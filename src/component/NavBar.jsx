export default function NavBar() {
  return (
    <div className="navbar bg-base-100 shadow-sm flex justify-between px-4">
      <div className="flex items-center">
        <a className="btn btn-ghost text-xl">Cantvas</a>
      </div>
      <div className="flex items-center gap-2">
        <a className="btn btn-ghost">Publish</a>
      </div>

    </div>
  );
}
