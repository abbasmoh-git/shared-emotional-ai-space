function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">
        Shared Emotional AI Space
      </h1>

      <div className="flex gap-4 text-sm font-medium">
        <a href="#" className="text-gray-700 hover:text-blue-600">
          Join Group
        </a>
        <a href="#" className="text-gray-700 hover:text-blue-600">
          Check-in
        </a>
        <a href="#" className="text-gray-700 hover:text-blue-600">
          Dashboard
        </a>
      </div>
    </nav>
  );
}

export default Navbar;