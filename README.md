# 概要

- GitHub PullRequest -(Web Hook)-> API Gateway -> Lambda -> CircleCI の経路でビルドをKickする

# Required

- Node.js 6.x
- [Serveless](https://serverless.com/)

# Deploy

serverless.yml の下記環境変数を変更してください。

```yaml
CIRCLECI_TOKEN:   # CircleCIのAPIを呼ぶためのトークン
TARGET_JOB:       # 実行するCircleCIのジョブ名
TARGET_REPO:      # 対象のGitHubリポジトリ
IGNORE_BRANCHES:  # 無視するブランチリスト(カンマ区切り)
```

- `serverless deploy`

