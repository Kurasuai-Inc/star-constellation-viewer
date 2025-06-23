# 🌌 Star Constellation Viewer

知識ネットワークを美しい星座として可視化するインタラクティブなWebアプリケーション。

## 📊 概要

プログラミング技術を宇宙の星座として表現し、101ノード・508リンクの豊富な知識ネットワークを視覚化。DRY原則に基づくシンプルで高品質な設計。

## ✨ 特徴

- **🎯 美しい星座可視化**: D3.jsによる物理シミュレーション
- **⚡ 高速パフォーマンス**: 50ノード制限による最適化
- **🔄 リアルタイム更新**: FastAPI連携
- **📱 レスポンシブ**: 全デバイス対応

## 🛠️ 技術スタック

### フロントエンド (frontend/)
- **React + TypeScript**: シンプルなコンポーネント設計
- **Vite**: 高速開発サーバー
- **D3.js**: データ可視化

### バックエンド (backend/)  
- **FastAPI**: 高速API
- **Python 3.11**: 型安全な実装

## 🚀 クイックスタート

```bash
# フロントエンド
cd frontend
npm install
npm run dev     # http://localhost:5173

# バックエンド (別ターミナル)
cd backend  
pip install -r requirements.txt
python main.py  # http://localhost:8000
```

## 📁 プロジェクト構造

```
star-constellation-viewer/
├── frontend/           # React + TypeScript
│   ├── src/
│   │   ├── App.tsx           # メインアプリ (DRY設計)
│   │   └── components/
│   │       └── StarConstellationGraph.tsx
│   └── package.json    
├── backend/            # FastAPI  
│   ├── main.py               # API (101ノード対応)
│   └── requirements.txt
└── .github/workflows/  # CI/CD
```

## 📊 データ構造

```typescript
interface Node {
  id: string;
  title: string;
  content: string;
  tags: string[];      // カテゴリ分類用
  links: string[];     // 関連ノードID
}
```

## 🎯 API エンドポイント

- `GET /` - サービス情報
- `GET /health` - ヘルスチェック  
- `GET /graph` - グラフデータ (101ノード・508リンク)
- `GET /stats` - 統計情報

## 🔧 開発原則

- **DRY**: コード重複排除
- **シンプル設計**: 最小限の依存関係
- **高品質**: TypeScript型安全性
- **パフォーマンス**: 50ノード制限表示

## 🚀 デプロイ

```bash
# フロントエンド: Vercel
vercel --prod

# バックエンド: Railway  
railway deploy
```

## 👥 開発者

- **Stella** 🌟 - フロントエンド・可視化
- **Seira** ✨ - バックエンド・CI/CD

---

💫 **シンプルで美しい星座可視化** - Created by Stella & Seira