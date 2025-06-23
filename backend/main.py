"""
Star Constellation Viewer Backend
セイラのFastAPIサーバー - 知識グラフデータを提供
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import json

app = FastAPI(
    title="Star Constellation API",
    description="知識ネットワーク可視化のためのAPI",
    version="1.0.0"
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# サンプルデータ（実際のデータはここに入ります）
SAMPLE_NODES = [
    {
        "id": "python",
        "title": "Python",
        "content": "汎用プログラミング言語。AI・Web開発・データ分析など幅広い用途で使用される。",
        "tags": ["プログラミング言語", "AI", "Web開発", "データ分析"],
        "links": ["django", "fastapi", "tensorflow", "pandas"]
    },
    {
        "id": "javascript",
        "title": "JavaScript",
        "content": "Web開発の標準言語。フロントエンドからバックエンドまで対応。",
        "tags": ["プログラミング言語", "Web開発", "フロントエンド"],
        "links": ["react", "nodejs", "typescript", "vue"]
    },
    {
        "id": "react",
        "title": "React",
        "content": "Meta社開発のフロントエンドライブラリ。コンポーネントベースのUI構築。",
        "tags": ["フレームワーク", "フロントエンド", "UI"],
        "links": ["javascript", "typescript", "vite", "nextjs"]
    },
    {
        "id": "fastapi",
        "title": "FastAPI",
        "content": "Python製の高速なWebフレームワーク。自動API文書生成機能付き。",
        "tags": ["フレームワーク", "バックエンド", "API"],
        "links": ["python", "uvicorn", "pydantic", "swagger"]
    },
    {
        "id": "d3js",
        "title": "D3.js",
        "content": "データ駆動のドキュメント操作ライブラリ。強力なデータ可視化機能。",
        "tags": ["ライブラリ", "データ可視化", "SVG"],
        "links": ["javascript", "svg", "canvas", "webgl"]
    },
    {
        "id": "threejs",
        "title": "Three.js",
        "content": "WebGL を使った3Dグラフィックスライブラリ。ブラウザで3D表現が可能。",
        "tags": ["ライブラリ", "3D", "WebGL"],
        "links": ["javascript", "webgl", "glsl", "babylon"]
    },
    {
        "id": "typescript",
        "title": "TypeScript",
        "content": "Microsoftが開発したJavaScriptに型システムを追加した言語。",
        "tags": ["プログラミング言語", "型システム", "JavaScript拡張"],
        "links": ["javascript", "react", "angular", "vscode"]
    },
    {
        "id": "vite",
        "title": "Vite",
        "content": "高速なフロントエンドビルドツール。開発サーバーとバンドラーを提供。",
        "tags": ["開発ツール", "ビルドツール", "フロントエンド"],
        "links": ["react", "vue", "typescript", "rollup"]
    },
    {
        "id": "docker",
        "title": "Docker",
        "content": "コンテナ仮想化プラットフォーム。アプリケーションの配布・運用を効率化。",
        "tags": ["開発ツール", "コンテナ", "デプロイ"],
        "links": ["kubernetes", "compose", "registry", "swarm"]
    },
    {
        "id": "git",
        "title": "Git",
        "content": "分散型バージョン管理システム。ソースコードの履歴管理と共同作業を支援。",
        "tags": ["開発ツール", "バージョン管理", "協業"],
        "links": ["github", "gitlab", "bitbucket", "sourcetree"]
    }
]

# より多くのデータを生成（101ノード、508リンクを達成するため）
def generate_extended_nodes():
    """拡張されたノードデータを生成"""
    base_categories = {
        "プログラミング言語": ["Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "Scala", "Clojure", "Haskell", "Erlang", "Elixir", "Dart", "R", "Julia"],
        "フレームワーク": ["React", "Vue", "Angular", "Svelte", "Django", "FastAPI", "Flask", "Express", "Koa", "Spring", "Laravel", "Rails", "ASP.NET", "Gin", "Echo", "Actix", "Symfony", "CodeIgniter", "CakePHP", "Zend"],
        "データベース": ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "CouchDB", "Neo4j", "SQLite", "Oracle", "SQL Server", "Cassandra", "DynamoDB", "Firebase", "Supabase", "PlanetScale", "Prisma", "TypeORM", "Sequelize", "Mongoose", "SQLAlchemy"],
        "開発ツール": ["Git", "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "GitLab CI", "Travis CI", "CircleCI", "Terraform", "Ansible", "Vagrant", "Webpack", "Vite", "Parcel", "Rollup", "ESLint", "Prettier", "Jest", "Cypress", "Playwright"],
        "クラウド": ["AWS", "Azure", "GCP", "Vercel", "Netlify", "Heroku", "Railway", "DigitalOcean", "Linode", "Vultr", "Cloudflare", "Firebase", "Supabase", "PlanetScale", "Upstash", "Neon", "FaunaDB", "Hasura", "Amplify", "Appwrite"],
        "AI・機械学習": ["TensorFlow", "PyTorch", "Scikit-learn", "Keras", "Pandas", "NumPy", "OpenCV", "NLTK", "spaCy", "Transformers", "Langchain", "OpenAI", "Anthropic", "Cohere", "Pinecone", "Weaviate", "ChromaDB", "FAISS", "Ollama", "LlamaIndex"]
    }
    
    nodes = []
    node_id = 0
    
    for category, items in base_categories.items():
        for item in items:
            if node_id >= 101:  # 101ノードで制限
                break
            
            # リンクを生成（他のノードとの関連性）
            links = []
            for other_cat, other_items in base_categories.items():
                if other_cat != category and len(links) < 8:  # 各ノードに最大8個のリンク
                    # 関連性の高いアイテムを選択
                    if len(other_items) > 0:
                        links.append(f"{other_cat.lower().replace('・', '_').replace(' ', '_')}_{other_items[0].lower().replace('.', '').replace('#', 'sharp').replace('+', 'plus').replace(' ', '_')}")
            
            nodes.append({
                "id": f"{category.lower().replace('・', '_').replace(' ', '_')}_{item.lower().replace('.', '').replace('#', 'sharp').replace('+', 'plus').replace(' ', '_')}",
                "title": item,
                "content": f"{item}は{category}の代表的な技術です。現代のソフトウェア開発において重要な役割を果たしています。",
                "tags": [category, "技術", "開発"],
                "links": links[:5]  # リンク数を制限
            })
            node_id += 1
            
        if node_id >= 101:
            break
    
    return nodes

@app.get("/")
async def root():
    """ルートエンドポイント"""
    return {
        "message": "Star Constellation API",
        "version": "1.0.0",
        "description": "知識ネットワーク可視化のためのAPI",
        "endpoints": {
            "/graph": "グラフデータの取得",
            "/health": "ヘルスチェック",
            "/docs": "API文書"
        }
    }

@app.get("/health")
async def health_check():
    """ヘルスチェックエンドポイント"""
    return {"status": "healthy", "service": "star-constellation-api"}

@app.get("/graph")
async def get_graph_data():
    """グラフデータを返すエンドポイント"""
    nodes = generate_extended_nodes()
    
    return {
        "nodes": nodes,
        "metadata": {
            "total_nodes": len(nodes),
            "total_links": sum(len(node["links"]) for node in nodes),
            "categories": list(set(tag for node in nodes for tag in node["tags"] if tag in ["プログラミング言語", "フレームワーク", "データベース", "開発ツール", "クラウド", "AI・機械学習"])),
            "last_updated": "2024-06-23T22:10:00Z"
        }
    }

@app.get("/stats")
async def get_stats():
    """統計情報を返すエンドポイント"""
    nodes = generate_extended_nodes()
    categories = {}
    
    for node in nodes:
        for tag in node["tags"]:
            if tag in ["プログラミング言語", "フレームワーク", "データベース", "開発ツール", "クラウド", "AI・機械学習"]:
                categories[tag] = categories.get(tag, 0) + 1
    
    return {
        "total_nodes": len(nodes),
        "total_links": sum(len(node["links"]) for node in nodes),
        "categories": categories,
        "avg_links_per_node": sum(len(node["links"]) for node in nodes) / len(nodes)
    }

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)