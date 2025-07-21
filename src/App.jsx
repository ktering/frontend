// src/App.jsx
import CategorySection from "./components/customer/home/CategorySection.jsx";
function App() {
  return (
    // <div className="min-h-screen flex flex-col">
    //   {/* Header */}
    //   <header className="bg-red-500 text-white p-4 shadow">
    //     <div className="container mx-auto flex justify-between items-center">
    //       <h1 className="text-2xl font-bold">Kterings</h1>
    //       <nav>
    //         <ul className="flex space-x-4">
    //           <li><a href="#" className="hover:underline">Home</a></li>
    //           <li><a href="#" className="hover:underline">Menu</a></li>
    //           <li><a href="#" className="hover:underline">Contact</a></li>
    //         </ul>
    //       </nav>
    //     </div>
    //   </header>

    //   {/* Hero Section */}
    //   <main className="flex-grow bg-gray-50 flex flex-col items-center justify-center text-center py-20">
    //     <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">Welcome to Kterings!</h2>
    //     <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
    //       Delicious food delivered to your door. Discover our wide range of dishes and catering services for any occasion.
    //     </p>
    //     <a href="#" className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-red-500 transition">
    //       Explore Menu
    //     </a>
    //   </main>

    //   {/* Footer */}
    //   <footer className="bg-red-500 text-white py-4 mt-auto">
    //     <div className="container mx-auto text-center">
    //       &copy; {new Date().getFullYear()} Kterings. All rights reserved.
    //     </div>
    //   </footer>
    // </div>

    <>
     <div className="min-h-screen bg-gray-50">
      <CategorySection />
    </div>
    </>
  );
}

export default App;
