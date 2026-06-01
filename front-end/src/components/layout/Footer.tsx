export function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} E-Shop. Dự án học tập NestJS + React.
      </div>
    </footer>
  );
}
