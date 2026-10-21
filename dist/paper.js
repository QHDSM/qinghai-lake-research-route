const methodSteps = [
  {
    index:'STEP 01',
    title:'识别真正的停留行为，而不是把所有GPS点都当成栖息地。',
    input:'时间戳、经纬度、个体编号组成的斑头雁轨迹。',
    method:'DBIC同时计算同一轨迹的时间密度，以及不同个体在邻域内的全局密度。',
    output:'从60,161个轨迹点中识别约290个停歇区域。',
    insight:'飞越某地不能证明该地适宜；停留行为更接近觅食、休息、换羽或繁殖等实际利用。'
  },
  {
    index:'STEP 02',
    title:'把停歇地投影到遥感影像上，生成可以训练的正负样本。',
    input:'与停歇时间最接近、空间上覆盖停歇地的Landsat 5 TM影像。',
    method:'将影像切成16 × 16像元块；与停歇地重叠者标为正样本，其余作为负样本。',
    output:'27,714个样本，其中正样本8,696个、负样本19,018个。',
    insight:'这是行为数据与遥感数据真正发生连接的一步；同时也是伪负样本和空间泄漏最容易出现的一步。'
  },
  {
    index:'STEP 03',
    title:'让模型同时读取地表空间纹理和短期气温变化。',
    input:'六个Landsat波段组成的二维影像块，以及影像日前后15天的逐日气温。',
    method:'2D-CNN提取遥感空间特征，1D-CNN提取温度时间特征，再将两个分支融合。',
    output:'一个包含遥感与温度信息的512维深度特征向量。',
    insight:'可迁移的核心是“按数据结构分支建模后再融合”，而不是照抄某一套2018年的网络层数。'
  },
  {
    index:'STEP 04',
    title:'用SVM完成影像块分类，再把结果还原成连续空间地图。',
    input:'M-CNN全连接层输出的512维融合特征。',
    method:'采用径向基核支持向量机（RBF-SVM）判断影像块类别，并对区域逐块推理。',
    output:'很低、低、高、很高等不同等级的潜在栖息地适宜性分布。',
    insight:'地图等级来源于分类模型，不是直接观测到的鸟类数量；应用时应同时给出概率、阈值和不确定性。'
  }
];

const detail = document.querySelector('#methodDetail');
document.querySelectorAll('.method-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const step = methodSteps[Number(tab.dataset.step)];
    document.querySelectorAll('.method-tab').forEach(item => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    detail.innerHTML = `<div class="detail-index">${step.index}</div>
      <h3>${step.title}</h3>
      <div class="detail-columns">
        <div><small>输入</small><p>${step.input}</p></div>
        <div><small>方法</small><p>${step.method}</p></div>
        <div><small>输出</small><p>${step.output}</p></div>
      </div>
      <div class="detail-insight"><span>为什么重要</span><p>${step.insight}</p></div>`;
  });
});

const scores = {
  accuracy:[.769,.781,.803,.817,.835,.864],
  f1:[.731,.768,.758,.780,.830,.842],
  auc:[.839,.870,.880,.879,.936,.928],
  precision:[.742,.713,.814,.817,.746,.852],
  recall:[.719,.840,.715,.746,.938,.832]
};
const modelNames = ['GLCM + SVM','DenseNet','CNN','CNN + SVM','M-CNN','M-CNN + SVM'];
const chart = document.querySelector('#modelChart');
function renderChart(metric){
  const values = scores[metric];
  const best = Math.max(...values);
  chart.innerHTML = modelNames.map((name,index) => `<div class="bar-item ${values[index]===best?'best':''}">
    <span class="bar-label">${name}</span><div class="bar-track"><div class="bar-fill" style="width:${values[index]*100}%"></div></div><span class="bar-value">${values[index].toFixed(3)}</span>
  </div>`).join('');
}
document.querySelectorAll('[data-metric]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-metric]').forEach(item => item.classList.toggle('active', item===button));
    renderChart(button.dataset.metric);
  });
});
renderChart('accuracy');

const routes = {
  gps:{label:'DBIC停歇地 + 行为阶段',model:'RF基线 → 多分支CNN',validation:'按个体、年份和空间分块',text:'先复现论文的“停歇地识别—影像块分类”，再加入水位、湿地格局和人类干扰变量。测试集必须保留完整个体或完整年份，避免随机切分带来的数据泄漏。'},
  survey:{label:'监测存在点 + 调查努力',model:'RF / XGBoost / MaxEnt优先',validation:'空间分块 + 年份外推',text:'没有连续轨迹时，不必强行使用DBIC。先把监测点与调查日期、调查时长、未检出记录整理成标准样本，再以可解释模型建立基线；样本达到足够规模后再评估影像CNN。'},
  none:{label:'分层抽样调查设计',model:'暂不训练深度模型',validation:'独立复核 + 重复调查',text:'先根据湿地类型、距水距离和人类干扰进行分层布点，覆盖河口、浅水、泥滩、草甸和道路邻近区。获得至少跨季节的存在/未检出记录后，再进入适宜性建模。'}
};
const routeResult = document.querySelector('#routeResult');
document.querySelectorAll('.route-option').forEach(button => {
  button.addEventListener('click', () => {
    const route = routes[button.dataset.route];
    document.querySelectorAll('.route-option').forEach(item => {
      const active = item===button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    routeResult.innerHTML = `<div><small>推荐标签</small><b>${route.label}</b></div><div><small>推荐模型</small><b>${route.model}</b></div><div><small>验证方式</small><b>${route.validation}</b></div><p>${route.text}</p>`;
  });
});

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.topbar nav a')];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
},{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(section => observer.observe(section));
