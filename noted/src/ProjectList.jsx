import React, { useState, useEffect } from 'react';
import './css/styles.css';  // Ensure this CSS file includes the styles above
import { Link } from 'react-router-dom';  // Import Link for routing

const ProjectList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState([]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Error state to handle API fetch errors
  const itemsPerPage = 9;

  const fetchProjects = async () => {
    const token = localStorage.getItem('token'); // Get the token from localStorage

    // Step 1: Check if token is missing
    if (!token) {
      alert("You must be logged in to view projects.");
      setLoading(false);  // Stop loading if no token
      return;
    }

    try {
      // Step 2: Fetch projects from the API
      const response = await fetch('/api/projectList', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      // Step 3: Parse the response body, regardless of the status code
      const data = await response.json();

      // Step 4: Check if the response is successful or contains the "No projects found" message
      if (response.ok) {
        // Projects found
        setProjects(data);  // Set the projects list
        setError(null);  // Reset error
      } else if (response.status === 404 && data.message === "No projects found for this user.") {
        // No projects found
        setProjects([]);  // Set empty projects array
        setError(null);  // Reset error (no projects, not an error)
      } else {
        // Handle any other errors (invalid token, server issues, etc.)
        throw new Error('Failed to fetch projects.');
      }
    } catch (err) {
      // Step 5: Handle errors if any (network issues, invalid token, etc.)
      console.error('Error fetching projects:', err);
      setError('There was an error loading the projects.');
    } finally {
      // Step 6: Stop loading (whether success or error)
      setLoading(false);
    }
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

  const decodeJwt = (token) => {
    try {
      // Step 1: Split the token into parts
      const parts = token.split('.');
  
      // Ensure the token is correctly formatted (should have 3 parts)
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }
  
      // Step 2: Decode the payload (second part)
      const base64Url = parts[1];  // The payload is the second part of the token
  
      // Step 3: Convert Base64Url to Base64
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  
      // Step 4: Decode Base64 string to a UTF-8 string
      const decodedPayload = atob(base64);
  
      // Step 5: Parse the decoded string into a JSON object
      const decodedToken = JSON.parse(decodedPayload);
  
      return decodedToken;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };
  

  const handleAddProject = async () => {
    if (newProjectTitle.trim()) {
      // Format the project title to lowercase and replace spaces with hyphens
      const formattedTitle = newProjectTitle
      const token = localStorage.getItem('token'); // Get the token from localStorage
  
      if (!token) {
        alert("You must be logged in to add a project.");
        return;
      }
  
      try {
        // Decode the token to extract the userId
        const decodedToken = decodeJwt(token);
        const userId = decodedToken.userId; // Extract userId from the decoded token
  
        // Make the API call with the userId from the token
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          },
          body: JSON.stringify({
            UserID: userId,  // Use the userId from the decoded token
            title: formattedTitle,
            thumbnail: '/path/to/thumbnail.jpg',  // Example thumbnail
          }),
        });
  
        if (response.ok) {
          // Refresh project list
          setNewProjectTitle('');  // Clear input
          setShowModal(false);  // Close modal
        } else {
          alert('Error creating project');
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        alert('Invalid token. Please log in again.');
      }
    } else {
      alert('Please enter a valid project title');
    }
  };
  

  // Rendering loading spinner or error message
  if (loading) {
    return <div className="text-center mt-5">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

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

        {/* Empty State for Projects */}
        {filteredProjects.length === 0 && (
          <div className="text-center mt-5">
            <h4>No projects found. Create a new one!</h4>
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
        {totalPages > 1 && filteredProjects.length > 0 && (
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
