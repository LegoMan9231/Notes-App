import React, { useState, useEffect } from 'react';
import './css/styles.css';  // Make sure this CSS file includes the styles above
import image from './assets/img/portfolio/thumbnails/5.jpg';

const Homepage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sample data for note templates
  const noteTemplates = [
    { id: 1, title: 'Meeting Notes', thumbnail: image },
    { id: 2, title: 'Project Plan', thumbnail: image },
    { id: 3, title: 'To-Do List', thumbnail: image },
    { id: 4, title: 'Brainstorming Session', thumbnail: image },
    { id: 5, title: 'Research Notes', thumbnail: image },
    { id: 6, title: 'Idea Generation', thumbnail: image },
    { id: 7, title: 'Daily Journal', thumbnail: image },
    { id: 8, title: 'Business Plan', thumbnail: image },
    { id: 9, title: 'Meeting Minutes', thumbnail: image },
    { id: 10, title: 'Client Proposal', thumbnail: image },
  ];

  // Filter the note templates based on the search term
  const filteredTemplates = noteTemplates.filter(template =>
    template.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get the current page templates (pagination logic)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTemplates = filteredTemplates.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination buttons
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNum) => setCurrentPage(pageNum);

  // Handle previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Reset the page to 1 whenever the search term changes
  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 on search
  }, [searchTerm]);

  // Handle navbar scroll effect (transparent until scrolling)
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="" />
        <meta name="author" content="" />
        <title>Creative - Start Bootstrap Theme</title>
        <link rel="icon" type="image/x-icon" href="src/assets/favicon.ico" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Merriweather+Sans:400,700" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Merriweather:400,300,300italic,400italic,700,700italic" rel="stylesheet" type="text/css" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/SimpleLightbox/2.1.0/simpleLightbox.min.css" rel="stylesheet" />
        <link href="./styles.css" rel="stylesheet" />
      </head> 
      <body id="page-top">
        <header className="masthead">
          <div className="container px-4 px-lg-5 h-100">
            <div className="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center text-center">
              <div className="col-lg-8 align-self-end">
                <h1 className="text-white font-weight-bold">DoolyNoted</h1>
                <hr className="divider" />
              </div>
              <div className="col-lg-8 align-self-baseline">
                <p className="text-white-75 mb-5">Your notes, organized effortlessly.</p>
                <input
                  type="text"
                  className="form-control form-control-lg mt-4 w-50 mx-auto"
                  placeholder="Search for note templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Note Templates with Pagination */}
            {filteredTemplates.length > 0 && (
              <div className="container mt-5">
                <div className="row row-cols-1 row-cols-md-3 g-4">
                  {currentTemplates.map((template) => (
                    <div key={template.id} className="col">
                      <div className="card h-100 shadow-sm border-light hover-card">
                        <div className="card-img-container">
                          <img
                            src={template.thumbnail}
                            className="card-img-top"
                            alt={template.title}
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                          <div className="overlay">
                            <h5 className="card-title">{template.title}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-container text-center mt-4">
                <ul className="pagination justify-content-center">
                  <li className="page-item">
                    <button className="page-link" onClick={handlePreviousPage}>{"<"}</button>
                  </li>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li className="page-item">
                    <button className="page-link" onClick={handleNextPage}>{">"}</button>
                  </li>
                </ul>
                <footer className="bg-light py-5">
                  <div className="container px-4 px-lg-5">
                    <div className="small text-center text-muted">Copyright &copy; 2023 - DoolyNoted</div>
                  </div>
                </footer>
              </div>
            )}
          </div>
        </header>
      </body>
    </div>
  );
};

export default Homepage;

