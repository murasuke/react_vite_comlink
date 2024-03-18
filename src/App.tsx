import { useEffect, useRef } from 'react';
import type { Remote } from 'comlink';
import { blockingFunc } from './blockingFunc';
import './App.css';

function App() {
  const roopCount = 300;
  // ComlinkWorkerをuseRefで保持
  const workerRef = useRef<Remote<typeof import('./worker')> | null>(null);

  useEffect(() => {
    // Workerを生成
    workerRef.current = new ComlinkWorker<typeof import('./worker')>(
      new URL('./worker', import.meta.url)
    );
  }, []);

  // comlink(web worker)による非同期処理。アニメーションが止まらない
  const handleClickWorker = async () => {
    if (workerRef.current) {
      console.log('start workerBlockingFunc()');
      const result = await workerRef.current.workerBlockingFunc(roopCount);
      console.log(`end workerBlockingFunc(): ${result}`);
    }
  };

  // 同期処理(画面のアニメーションが止まる)
  const handleClickSync = async () => {
    if (workerRef.current) {
      console.log('start blockingFunc()');
      const result = blockingFunc(roopCount);
      console.log(`end blockingFunc(): ${result}`);
    }
  };

  return (
    <div>
      <button onClick={() => handleClickWorker()}>
        時間がかかる関数をcomlinkで非同期的に実行
      </button>
      <br />
      <button onClick={() => handleClickSync()}>
        時間がかかる関数を同期的に実行
      </button>
      <div className="return">実行結果はDevToolsのConsoleに出力されます。</div>
    </div>
  );
}

export default App;
