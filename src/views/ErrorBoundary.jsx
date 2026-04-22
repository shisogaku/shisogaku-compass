import React from 'react';

/**
 * ErrorBoundary
 * - 子ツリーで投げられた例外を捕捉してフォールバックUIを出す
 * - 「リトライ」で children を再マウント、「リロード」で全体再読込
 * - localStorage クリア＋リロードの導線も用意（破損データからの復帰用）
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null, retryKey: 0 };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // 開発時はコンソールに出して、デプロイ後の調査を可能にする
    if (typeof console !== 'undefined') {
      console.error('[ErrorBoundary]', error, info);
    }
    this.setState({ info });
  }

  handleRetry = () => {
    this.setState(s => ({ error: null, info: null, retryKey: s.retryKey + 1 }));
  };

  handleReload = () => {
    if (typeof window !== 'undefined') window.location.reload();
  };

  handleResetLocal = () => {
    try {
      // 支礎学コンパスのローカル状態を丸ごとリセット
      Object.keys(localStorage)
        .filter(k => k.startsWith('sg_') || k === 'profiles' || k === 'myId')
        .forEach(k => localStorage.removeItem(k));
    } catch {}
    this.handleReload();
  };

  render() {
    if (!this.state.error) {
      // retryKey で children を再マウントできる
      return (
        <React.Fragment key={this.state.retryKey}>
          {this.props.children}
        </React.Fragment>
      );
    }

    const message = (this.state.error && (this.state.error.message || String(this.state.error))) || '不明なエラー';

    return (
      <div role="alert" aria-live="assertive"
        className="min-h-screen flex items-center justify-center p-4"
        style={{background:'#fdf9f3'}}>
        <div className="bg-white rounded-2xl p-6 max-w-md w-full"
          style={{boxShadow:'0 4px 24px rgba(180,130,70,0.15)', border:'1px solid rgba(180,130,70,0.18)'}}>
          <div className="flex items-start gap-3 mb-4">
            <div aria-hidden="true"
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
              style={{background:'#fde2e2', color:'#b91c1c'}}>!</div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold text-gray-800 leading-tight">
                予期しないエラーが発生しました
              </h1>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                ご不便をおかけしてすみません。下のボタンから復帰してください。
              </p>
            </div>
          </div>

          <details className="mb-4 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
            <summary className="cursor-pointer font-medium text-gray-600">エラー詳細</summary>
            <p className="mt-2 break-all font-mono whitespace-pre-wrap">{message}</p>
          </details>

          <div className="flex flex-col gap-2">
            <button type="button" onClick={this.handleRetry}
              className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow"
              style={{background:'linear-gradient(135deg,#92400e,#b45309)'}}>
              もう一度試す
            </button>
            <button type="button" onClick={this.handleReload}
              className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-amber-900"
              style={{background:'rgba(146,64,14,0.08)', border:'1px solid rgba(146,64,14,0.18)'}}>
              ページを再読込
            </button>
            <button type="button" onClick={this.handleResetLocal}
              className="w-full px-4 py-2 rounded-xl text-xs text-gray-500 hover:text-gray-700">
              ローカルデータを初期化して再読込
            </button>
          </div>
        </div>
      </div>
    );
  }
}
