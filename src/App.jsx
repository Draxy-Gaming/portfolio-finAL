import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Experiences from "./sections/Experiences";
import Testimonial from "./sections/Testimonial";
import Contact from "./sections/Contact";
import Footer from './sections/Footer';

// Movies Components (to be created)
import MoviesPage from "./components/movies/MoviesPage";
import MovieDetail from "./components/movies/MovieDetail";
import AdminMovies from "./components/admin/AdminMovies";
import AddMovie from "./components/admin/AddMovie";
import EditMovie from "./components/admin/EditMovie";
import AdminCategories from "./components/admin/AdminCategories";

const PortfolioHome = () => (
  <>
    <Hero />
    <About />
    <Projects />
    <Experiences />
    <Testimonial />
    <Contact />
  </>
);

const App = () => {
  return (
    <div className="container mx-auto max-w-7xl bg-primary min-h-screen text-neutral-300">
      <Navbar />
      <Routes>
        <Route path="/" element={<PortfolioHome />} />

        {/* Public Movies Routes */}
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/movies/:identifier" element={<MovieDetail />} />

        {/* Admin Movies Routes */}
        <Route path="/admin/movies" element={<AdminMovies />} />
        <Route path="/admin/movies/add" element={<AddMovie />} />
        <Route path="/admin/movies/:id/edit" element={<EditMovie />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
      </Routes>
      <Footer/>
    </div>
  );
};

export default App;
