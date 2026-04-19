# 紫微斗数网站 - 部署指南

## 功能更新说明 (v2.0)

本次更新添加了以下核心功能：

### 1. 辅星系统
- **吉星**: 左辅、右弼、文昌、文曲、天魁、天钺、禄存、天马
- **煞星**: 擎羊、陀罗、火星、铃星、地空、地劫
- 完整的辅星排布算法，根据生辰八字自动定位

### 2. 四化系统
- **化禄、化权、化科、化忌** 完整四化星计算
- 支持年干四化和流年四化
- 四化星对宫位的影响分析

### 3. 流年分析
- 详细流年运势预测（事业、财富、感情、健康）
- 支持查询任意年份的流年命盘
- 流年四化对原局的影响分析

### 4. 十年大运优化
- 更详细的大限运势分析
- 前十年回顾与未来十年预测
- 大限转换提醒和建议

## 自动部署配置

### 方式一：Cloudflare Pages 自动部署（推荐）

1. **连接 GitHub 仓库到 Cloudflare Pages**
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 进入 Pages → Create a project
   - 选择 `Connect to Git`
   - 选择仓库 `jm6-lang/ziwei-site`
   - 设置构建配置：
     - Build command: `npm run build`
     - Build output directory: `dist`
   - 点击 `Save and Deploy`

2. **配置环境变量**（可选）
   - 在 Cloudflare Pages 项目设置中
   - 添加环境变量（如需要）

3. **自动部署**
   - 每次推送到 `master` 分支时，Cloudflare Pages 会自动构建和部署
   - 可在 Cloudflare Dashboard 查看部署历史和状态

### 方式二：GitHub Actions 自动部署

1. **配置 Cloudflare API 密钥**
   - 在 GitHub 仓库 Settings → Secrets and variables → Actions
   - 添加以下 secrets：
     - `CLOUDFLARE_API_TOKEN`: Cloudflare API 令牌
     - `CLOUDFLARE_ACCOUNT_ID`: Cloudflare 账户 ID

2. **获取 Cloudflare API 令牌**
   - 登录 Cloudflare Dashboard
   - 进入 My Profile → API Tokens
   - 创建自定义令牌，权限：
     - Account.Cloudflare Pages: Edit
   - 复制令牌并保存到 GitHub Secrets

3. **自动触发**
   - 推送到 `master` 分支时自动触发部署
   - 可在 Actions 标签页查看部署状态

### 方式三：手动部署

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 使用 wrangler 部署到 Cloudflare Pages
npx wrangler pages deploy dist --project-name=ziwei-site
```

## Cloudflare Workers API 部署（可选）

如果需要将排盘功能作为 API 服务部署到 Cloudflare Workers：

1. 创建 Worker 项目：
```bash
npx wrangler init ziwei-api
cd ziwei-api
```

2. 将 `src/lib/ziping-calculator.ts` 复制到 Worker 项目

3. 创建 API 端点（`src/index.ts`）：
```typescript
import { calculateZiWeiChart, generateTenYearFortune } from './lib/ziping-calculator';

export default {
  async fetch(request: Request) {
    const url = new URL(request.url);
    
    if (url.pathname === '/api/ziping') {
      const birthInfo = await request.json();
      const chart = calculateZiWeiChart(birthInfo);
      const fortune = generateTenYearFortune(chart);
      
      return Response.json({ chart, fortune });
    }
    
    return new Response('Not Found', { status: 404 });
  }
};
```

4. 部署 Worker：
```bash
npx wrangler deploy
```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:4321
```

## 技术栈

- **框架**: Astro 6.0
- **文档**: Starlight
- **部署**: Cloudflare Pages
- **CI/CD**: GitHub Actions
- **语言**: TypeScript

## 注意事项

1. **Cloudflare API 令牌安全**
   - 不要将 API 令牌提交到 GitHub
   - 使用 GitHub Secrets 管理敏感信息
   - 定期轮换 API 令牌

2. **构建优化**
   - Cloudflare Pages 有 15 分钟的构建超时限制
   - 确保构建过程在时限内完成
   - 优化静态资源大小

3. **域名配置**
   - 在 Cloudflare Pages 项目中可绑定自定义域名
   - 自动获得 HTTPS 证书
   - 享受 Cloudflare CDN 加速

## 常见问题

**Q: 如何查看部署日志？**
A: 在 Cloudflare Dashboard → Pages → 选择项目 → Deployments 查看

**Q: 部署失败怎么办？**
A: 检查构建日志，确认 `npm run build` 能成功执行

**Q: 如何回滚到旧版本？**
A: 在 Cloudflare Pages 的 Deployments 页面找到历史版本，点击 "Rollback"

---

如需帮助，请提交 Issue 或联系项目维护者。
