export default function Auth({ user, onSignIn, onSignOut }) {
  if (user) {
    const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email || '사용자';
    const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;

    return (
      <div className="flex items-center gap-2">
        {avatar && (
          <img
            src={avatar}
            alt="프로필"
            className="w-7 h-7 rounded-full object-cover border border-gray-200"
          />
        )}
        <span className="text-xs text-gray-600 hidden sm:block max-w-[100px] truncate">{displayName}</span>
        <button
          onClick={onSignOut}
          className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-2.5 py-1 rounded-full transition-colors"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onSignIn}
      className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors shadow-sm"
    >
      <KakaoIcon />
      카카오 로그인
    </button>
  );
}

function KakaoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.75 1.742 5.16 4.368 6.6L5.4 21l4.752-2.88C10.7 18.37 11.345 18.4 12 18.4c5.523 0 10-3.477 10-7.6S17.523 3 12 3z" />
    </svg>
  );
}
