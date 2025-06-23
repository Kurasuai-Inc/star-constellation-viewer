# 🌌 Star Constellation Viewer

知識ネットワークを美しい星座として可視化するインタラクティブなWebアプリケーション。

## 概要

Star Constellation Viewerは、プログラミング言語、フレームワーク、ツール、アルゴリズムなどの技術的な知識を、宇宙に輝く星座のように表現します。各技術はノード（星）として表示され、それらの関係性はリンク（星座線）として視覚化されます。

## 特徴

- **2D Force-directed Graph**: D3.jsを使用した物理シミュレーションによる2Dグラフ表示
- **3D Constellation View**: Three.jsによる立体的な星座表現
- **インタラクティブ**: ドラッグ、ズーム、回転による直感的な操作
- **関係性の可視化**: 
  - 使用 (uses)
  - 派生 (derives from)
  - 競合 (competes with)
  - 補完 (complements)
  - 実装 (implements)

## 技術スタック

- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **Visualization Libraries**:
  - D3.js (2D Force-directed graphs)
  - Three.js (3D graphics)
- **Styling**: CSS3 with modern features

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# プロダクションビルド
npm run build

# ビルドのプレビュー
npm run preview
```

## プロジェクト構造

```
star-constellation-viewer/
├── src/
│   ├── components/
│   │   ├── ForceGraph.tsx      # D3.js 2Dグラフコンポーネント
│   │   └── ConstellationView.tsx # Three.js 3Dビューコンポーネント
│   ├── App.tsx                 # メインアプリケーション
│   ├── App.css                 # スタイリング
│   └── main.tsx               # エントリーポイント
├── public/                     # 静的アセット
└── package.json               # プロジェクト設定
```

## データ形式

### ノード (Node)
```typescript
interface Node {
  id: string;          // 一意識別子
  name: string;        // 表示名
  category: string;    // カテゴリ (language, framework, tool, etc.)
  tags: string[];      // 関連タグ
}
```

### リンク (Link)
```typescript
interface Link {
  source: string;      // ソースノードID
  target: string;      // ターゲットノードID
  relationship: string; // 関係性の種類
  strength: number;    // 関係の強さ (0-1)
}
```

## 今後の展開

- [ ] star-tactics-roomとの連携API
- [ ] リアルタイムデータ更新
- [ ] フィルタリング機能
- [ ] 検索機能
- [ ] ノード詳細情報の表示
- [ ] アニメーション効果の追加
- [ ] パフォーマンス最適化

## デプロイ

Vercelでのデプロイを推奨:

```bash
# Vercel CLIのインストール
npm i -g vercel

# デプロイ
vercel
```

## 開発者

- **Stella** - 可視化・フロントエンド担当 🌟
- **Seira** - データ収集・バックエンド担当 ✨

## ライセンス

MIT License

---

Created with 💫 by Stella & Seira