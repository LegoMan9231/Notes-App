import React, { useState, useEffect } from 'react';
import './css/styles.css';  // Make sure this CSS file includes the styles above
import { Link } from 'react-router-dom';  // Import Link for routing

const ProjectList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState([]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 9;

  // Fetch projects from the backend
  const fetchProjects = async () => {
    const response = await fetch('/api/projects');
    const data = await response.json();
    setProjects(data);
  };

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter the projects based on the search term
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get the current page projects (pagination logic)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination buttons
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

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

  // Handle adding a new project
  const handleAddProject = async () => {
    if (newProjectTitle.trim()) {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          UserID: 1,  // Example UserID, you can replace it with actual user data
          title: newProjectTitle,
          thumbnail: '/path/to/thumbnail.jpg'  // Example thumbnail
        }),
      });

      if (response.ok) {
        fetchProjects(); // Refresh project list
        setNewProjectTitle('');
        setShowModal(false);
      } else {
        alert('Error creating project');
      }
    } else {
      alert('Please enter a valid project title');
    }
  };

  return (
    <body className='background'>
      <main>
        <div className="container px-4 px-lg-5 h-100">
          <div className="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center text-center">
            <div className="col-lg-8 align-self-baseline">
              <input
                type="text"
                className="form-control form-control-lg mt-4 w-50 mx-auto"
                placeholder="Search your projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Button to open modal for creating a new project */}
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Create New Project
          </button>
        </div>

        {/* Modal for creating new project */}
        {showModal && (
          <div className="modal" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create New Project</h5>
                  <button className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter project name"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                  <button className="btn btn-primary" onClick={handleAddProject}>Add Project</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects List with Pagination */}
        {filteredProjects.length > 0 && (
          <div className="container mt-5">
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {currentProjects.map((project) => (
                <div key={project.ProjectID} className="col">
                  <Link to={`/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}`} className="card h-100 shadow-sm border-light hover-card">
                    <div className="card-img-container">
                      <img
                        src={project.thumbnail}
                        className="card-img-top"
                        alt={project.title}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="overlay">
                        <h5 className="card-title">{project.title}</h5>
                      </div>
                    </div>
                  </Link>
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
          </div>
        )}
      </main>

      <footer className="bg-light py-5">
        <div className="container px-4 px-lg-5">
          <div className="small text-center text-muted">Copyright &copy; 2023 - DoolyNoted</div>
        </div>
      </footer>
    </body>
  );
};

export default ProjectList;

