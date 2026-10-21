# 青海湖高原湖泊湿地研究路线图谱

《青海湖高原湖泊湿地演变趋势及应对措施》的交互式技术路线导读。

网站按照“输入数据 → 方法/模型 → 直接输出 → 下一步用途”拆解报告中的主要研究环节，包括：

- 湖泊面积、水位与水量重建
- 除水体外湿地的随机森林分类
- 气候影响因素分析
- air2water 表层水温重建
- 透明度与盐度遥感反演
- 水生态与碳源汇分析
- RF + GAN 未来水量预测
- 水位、面积换算及道路与居民点暴露分析

## 本地查看

网站是纯静态页面，可直接打开 `dist/index.html`，也可以用任意静态文件服务器托管 `dist/`。

## GitHub Pages

推送到 GitHub 后，仓库内的 Pages 工作流会自动部署 `dist/` 目录。部署地址会显示在仓库的 **Settings → Pages** 和工作流运行结果中。

## 内容说明

本站用于解释报告的研究结构和证据传递关系，不替代原报告。网站标出的模型局限与数值口径问题，是依据报告文本进行的阅读核对。

## 论文专题

`dist/paper.html` 是《Modeling Habitat Suitability of Migratory Birds from Remote Sensing Images Using Convolutional Neural Networks》的独立精读页面，详细介绍研究问题、数据与标签、DBIC算法、M-CNN结构、实验设计、定量和空间结果、贡献与局限；页面末章再说明怎样把方法迁移到青海湖湿地项目。
