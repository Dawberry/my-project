// Hamburger icon toggle for sidebar
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const main = document.getElementById('main');

hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    main.classList.toggle('sidebar-open');
});

// Function to switch between sidebar sections (tabs)
const navButtons = document.querySelectorAll('.nav-button');
const tabContents = document.querySelectorAll('.tab-content');

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const section = button.getAttribute('data-section');
        
        // Hide all tab contents
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Show the selected section
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
       
        sidebar.classList.remove('open');
        main.classList.remove('sidebar-open');
    });
});


function goBackToDashboard() {
    
    tabContents.forEach(content => content.classList.remove('active'));
    
    
    const dashboard = document.getElementById('dashboard');
    if (dashboard) {
        dashboard.classList.add('active');
    }
}


document.addEventListener('click', (event) => {
    if (!sidebar.contains(event.target) && !hamburger.contains(event.target) && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        main.classList.remove('sidebar-open');
    }
});