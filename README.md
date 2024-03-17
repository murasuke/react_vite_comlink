# Web Workerを非同期関数として呼び出すことができるComlinkをReact(+vite)に導入する手順

## はじめに

以前、[create-react-app(TypeScript)で作成したアプリにWeb Workerを導入する方法](https://qiita.com/murasuke/items/897faa6b2e6e071bbcd0)
という記事を書いたのですが、CRAは使わなくなってきたのでvite版の利用方法を調べました

### [Comlink](https://github.com/GoogleChromeLabs/comlink)とは

Googleが作成したライブラリです

公式サイトの説明
> Comlink makes WebWorkers enjoyable. Comlink is a tiny library (1.1kB), that removes the mental barrier of thinking about postMessage and hides the fact that you are working with workers.
> At a more abstract level it is an RPC implementation for postMessage and ES6 Proxies.

翻訳([DeepL](https://www.deepl.com/))
> ComlinkはWebWorkersを楽しくします。Comlinkは小さなライブラリ(1.1kB)で、postMessageについて考えるという精神的な障壁を取り除き、ワーカーを使っているという事実を隠してくれます。
> より抽象的なレベルでは、postMessageとES6プロキシのRPC実装です。

 * 平たく言うと
portMessageで呼び出す必要がある`Web Worker`を、非同期メソッドとして呼び出すことを可能にしてくれるライブラリ、といったイメージです


## 作成手順

### プロジェクト作成
* viteでReactプロジェクトを作成

```bash
$ npm create vite@latest react_vite_web_worker  -- --template react-ts
$ cd react_vite_web_worker
$ code .
```

### comlinをインストール

* comlinkをインストールする
```bash
$ npm i complink
$ npm i -D vite-plugin-comlink
```

* `vite.config.ts`の設定変更

`vite-plugin-comlink`をimportして、pluginを設定します

```typescript:vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { comlink } from 'vite-plugin-comlink';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), comlink()],
  worker: {
    plugins: [comlink()],
  },
});
```

* comlinkの型定義

型定義を利用するため、下記1行を追加します
```typescript:./src/vite-env.d.ts
/// <reference types="vite-plugin-comlink/client" />
```

### 時間がかかるテスト関数を作成

そのまま実行すると、メインスレッド(画面の再描画)をブロックする関数を作成します

```typescript:./src/blockingFunc.ts
/**
 * 時間がかかる処理(iterations:300で2秒前後)
 * @param iterations
 * @returns random()の合計
 */
export const blockingFunc = (iterations: number): number => {
  console.log(`\titerations: ${iterations} * 1,000,000 loop`);

  let result = 0;
  for (let i = 0; i < iterations; i++) {
    for (let j = 0; j < 1_000_000; j++) {
      result += Math.random();
    }
  }
  console.log(`\tresult:${result}`);
  // randomの合計を返す
  return result;
};
```

### comlinkでWorker化する処理

```typescript:./src/worker.ts
import { blockingFunc } from './blockingFunc';

export const workerBlockingFunc = (iterations: number): number => {
  console.log(`Web Worker 処理開始`);

  // randomの合計を返す
  return blockingFunc(iterations);
};

```







https://www.npmjs.com/package/vite-plugin-comlink

https://dev.to/franciscomendes10866/how-to-use-service-workers-with-react-17p2
