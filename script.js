// Notes Application Class
class NotesApp {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || this.getDefaultNotes();
        this.folders = JSON.parse(localStorage.getItem('folders')) || this.getDefaultFolders();
        this.currentNote = null;
        this.currentFolder = 'all';
        this.isListView = false;
        this.isDarkTheme = localStorage.getItem('darkTheme') === 'true';
        
        this.init();
    }

    getDefaultNotes() {
        return [
            {
                id: '1',
                title: 'Meeting Notes',
                content: '<h2>Project Meeting - March 15, 2023</h2><p><strong>Attendees:</strong> John, Sarah, Michael, Lisa</p><h3>Agenda Items:</h3><ul><li>Q3 Project Timeline Review</li><li>Design System Updates</li><li>Technical Debt Discussion</li><li>Team Resource Allocation</li></ul><h3>Action Items:</h3><ol><li>Sarah to follow up with design team about UI components (Due: March 20)</li><li>Michael to create technical specification document (Due: March 22)</li><li>John to review resource allocation with HR (Due: March 18)</li></ol><p><em>Next meeting scheduled for March 29, 2023</em></p>',
                folder: 'personal',
                tags: ['work', 'meeting'],
                attachments: 2,
                lastEdited: Date.now() - 86400000, // Yesterday
                created: Date.now() - 86400000
            },
            {
                id: '2',
                title: 'React Hooks Guide',
                content: '<h2>React Hooks Reference</h2><h3>Basic Hooks:</h3><ul><li><strong>useState</strong> - Manage component state</li><li><strong>useEffect</strong> - Handle side effects</li><li><strong>useContext</strong> - Access context values</li></ul><h3>Additional Hooks:</h3><ul><li><strong>useReducer</strong> - Complex state logic</li><li><strong>useMemo</strong> - Memoize expensive calculations</li><li><strong>useCallback</strong> - Memoize functions</li><li><strong>useRef</strong> - Direct DOM access</li><li><strong>useLayoutEffect</strong> - Synchronous version of useEffect</li></ul>',
                folder: 'coding',
                tags: ['react', 'javascript'],
                attachments: 1,
                lastEdited: Date.now() - 172800000, // 2 days ago
                created: Date.now() - 172800000
            },
            {
                id: '3',
                title: 'App Improvement Ideas',
                content: '<h2>Feature Ideas for Notes App</h2><h3>UI/UX Improvements:</h3><ul><li>Dark mode toggle</li><li>Customizable themes</li><li>Keyboard shortcuts</li><li>Drag and drop organization</li></ul><h3>Functionality:</h3><ul><li>Export notes as PDF/Markdown</li><li>Collaborative editing</li><li>Mobile app version</li><li>AI-powered suggestions</li><li>Version history</li></ul>',
                folder: 'ideas',
                tags: ['ideas', 'improvements'],
                attachments: 0,
                lastEdited: Date.now() - 604800000, // Last week
                created: Date.now() - 604800000
            },
            {
                id: '4',
                title: 'Project Requirements',
                content: '<h2>Project Technical Requirements</h2><h3>Core Features:</h3><ul><li>User authentication and authorization</li><li>Real-time updates with WebSockets</li><li>File upload and storage</li><li>Responsive design for all devices</li></ul><h3>Technical Stack:</h3><ul><li>Frontend: React with TypeScript</li><li>Backend: Node.js with Express</li><li>Database: MongoDB</li><li>Storage: AWS S3 for files</li></ul><h3>Quality Requirements:</h3><ul><li>Accessibility compliance (WCAG 2.1)</li><li>Performance optimization</li><li>Security best practices</li><li>Comprehensive testing</li></ul>',
                folder: 'work',
                tags: ['project', 'requirements'],
                attachments: 3,
                lastEdited: Date.now() - 2592000000, // 30 days ago
                created: Date.now() - 2592000000
            }
        ];
    }

    getDefaultFolders() {
        return [
            { id: 'personal', name: 'Personal', color: '#4361ee', icon: '📁' },
            { id: 'work', name: 'Work', color: '#f72585', icon: '📁' },
            { id: 'coding', name: 'Coding', color: '#4cc9f0', icon: '📁' },
            { id: 'ideas', name: 'Ideas', color: '#7209b7', icon: '📁' }
        ];
    }

    init() {
        this.setupEventListeners();
        this.applyTheme();
        this.renderFolders();
        this.renderNotes();
        this.setupAutoSave();
    }

    setupEventListeners() {
        // DOM Elements
        this.newNoteBtn = document.getElementById('newNoteBtn');
        this.folderModal = document.getElementById('folderModal');
        this.closeModalBtns = document.querySelectorAll('.close-modal');
        this.addFolderBtn = document.querySelector('.add-folder-btn');
        this.createFolderBtn = document.getElementById('createFolder');
        this.editorContent = document.getElementById('editorContent');
        this.editorTitle = document.querySelector('.editor-title');
        this.toolbarBtns = document.querySelectorAll('.toolbar-btn');
        this.pasteScreenshotBtn = document.getElementById('pasteScreenshot');
        this.insertImageBtn = document.getElementById('insertImage');
        this.saveNoteBtn = document.getElementById('saveNote');
        this.saveDraftBtn = document.getElementById('saveDraft');
        this.themeToggle = document.getElementById('themeToggle');
        this.toggleView = document.getElementById('toggleView');
        this.notesGrid = document.getElementById('notesGrid');
        this.searchInput = document.querySelector('.search-bar input');

        // Event Listeners
        this.newNoteBtn.addEventListener('click', () => this.createNewNote());
        this.addFolderBtn.addEventListener('click', () => this.showFolderModal());
        this.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => this.hideFolderModal());
        });
        this.createFolderBtn.addEventListener('click', () => this.createNewFolder());
        this.saveNoteBtn.addEventListener('click', () => this.saveNote());
        this.saveDraftBtn.addEventListener('click', () => this.saveDraft());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.toggleView.addEventListener('click', () => this.toggleViewMode());
        this.searchInput.addEventListener('input', (e) => this.searchNotes(e.target.value));

        // Toolbar functionality
        this.toolbarBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const command = btn.dataset.command;
                const value = btn.dataset.value;
                
                if (command === 'formatBlock') {
                    document.execCommand(command, false, value);
                } else {
                    document.execCommand(command, false, null);
                }
                
                this.editorContent.focus();
            });
        });

        // Insert image functionality
        this.insertImageBtn.addEventListener('click', () => {
            const url = prompt('Enter image URL:');
            if (url) {
                document.execCommand('insertImage', false, url);
            }
        });

        // Paste screenshot functionality
        this.pasteScreenshotBtn.addEventListener('click', () => this.pasteScreenshot());

        // Editor events
        this.editorTitle.addEventListener('input', () => this.handleTitleChange());
        this.editorContent.addEventListener('input', () => this.handleContentChange());

        // Folder and note selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.folder')) {
                this.selectFolder(e.target.closest('.folder'));
            }
            if (e.target.closest('.note-card')) {
                this.selectNote(e.target.closest('.note-card'));
            }
            if (e.target.closest('.menu-item')) {
                this.selectMenu(e.target.closest('.menu-item'));
            }
        });
    }

    setupAutoSave() {
        setInterval(() => {
            if (this.currentNote) {
                this.saveNote(true);
            }
        }, 30000); // Auto-save every 30 seconds
    }

    createNewNote() {
        const newNote = {
            id: 'note-' + Date.now(),
            title: 'Untitled Note',
            content: '<p>Start typing your new note...</p>',
            folder: this.currentFolder === 'all' ? 'personal' : this.currentFolder,
            tags: [],
            attachments: 0,
            lastEdited: Date.now(),
            created: Date.now()
        };

        this.notes.unshift(newNote);
        this.currentNote = newNote;
        this.saveToStorage();
        this.renderNotes();
        this.loadNoteIntoEditor(newNote);
        
        this.showNotification('New note created');
    }

    selectNote(noteElement) {
        const noteId = noteElement.dataset.noteId;
        const note = this.notes.find(n => n.id === noteId);
        
        if (note) {
            this.currentNote = note;
            this.loadNoteIntoEditor(note);
            
            // Update active states
            document.querySelectorAll('.note-card').forEach(card => {
                card.classList.remove('active');
            });
            noteElement.classList.add('active');
        }
    }

    loadNoteIntoEditor(note) {
        this.editorTitle.value = note.title;
        this.editorContent.innerHTML = note.content;
        this.updateEditorInfo(note);
    }

    updateEditorInfo(note) {
        const editorInfo = document.querySelector('.editor-info');
        const lastEdited = new Date(note.lastEdited).toLocaleString();
        editorInfo.textContent = `Last edited: ${lastEdited}`;
    }

    handleTitleChange() {
        if (this.currentNote) {
            this.currentNote.title = this.editorTitle.value;
            this.currentNote.lastEdited = Date.now();
            this.updateNoteInList();
        }
    }

    handleContentChange() {
        if (this.currentNote) {
            this.currentNote.content = this.editorContent.innerHTML;
            this.currentNote.lastEdited = Date.now();
        }
    }

    saveNote(isAutoSave = false) {
        if (this.currentNote) {
            this.currentNote.lastEdited = Date.now();
            this.saveToStorage();
            this.updateNoteInList();
            
            if (!isAutoSave) {
                this.showNotification('Note saved successfully');
            }
        }
    }

    saveDraft() {
        this.showNotification('Draft saved');
    }

    updateNoteInList() {
        const noteElement = document.querySelector(`[data-note-id="${this.currentNote.id}"]`);
        if (noteElement) {
            const titleElement = noteElement.querySelector('h3');
            const contentElement = noteElement.querySelector('p');
            const metaElement = noteElement.querySelector('.note-meta span:first-child');
            
            if (titleElement) titleElement.textContent = this.currentNote.title;
            if (contentElement) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = this.currentNote.content;
                contentElement.textContent = tempDiv.textContent.substring(0, 100) + '...';
            }
            if (metaElement) {
                metaElement.textContent = this.getRelativeTime(this.currentNote.lastEdited);
            }
        }
    }

    selectFolder(folderElement) {
        const folderId = folderElement.dataset.folderId;
        this.currentFolder = folderId;
        
        // Update active states
        document.querySelectorAll('.folder').forEach(f => {
            f.classList.remove('active');
        });
        folderElement.classList.add('active');
        
        this.renderNotes();
        this.showNotification(`Showing notes from "${folderElement.querySelector('span').textContent}"`);
    }

    selectMenu(menuElement) {
        const menuText = menuElement.querySelector('span').textContent.toLowerCase();
        
        // Update active states
        document.querySelectorAll('.menu-item').forEach(m => {
            m.classList.remove('active');
        });
        menuElement.classList.add('active');
        
        if (menuText === 'all notes') {
            this.currentFolder = 'all';
            this.renderNotes();
        }
        
        this.showNotification(`Showing ${menuText}`);
    }

    showFolderModal() {
        this.folderModal.classList.add('active');
    }

    hideFolderModal() {
        this.folderModal.classList.remove('active');
        document.getElementById('folderName').value = '';
    }

    createNewFolder() {
        const folderName = document.getElementById('folderName').value;
        const folderColor = document.getElementById('folderColor').value;
        
        if (!folderName.trim()) {
            this.showNotification('Please enter a folder name', 'error');
            return;
        }
        
        const newFolder = {
            id: 'folder-' + Date.now(),
            name: folderName,
            color: folderColor,
            icon: '📁'
        };
        
        this.folders.push(newFolder);
        this.saveToStorage();
        this.renderFolders();
        this.hideFolderModal();
        
        this.showNotification(`Folder "${folderName}" created`);
    }

    pasteScreenshot() {
        if (!navigator.clipboard) {
            this.showNotification('Clipboard API not supported in your browser', 'error');
            return;
        }
        
        navigator.clipboard.read().then(clipboardItems => {
            for (const clipboardItem of clipboardItems) {
                for (const type of clipboardItem.types) {
                    if (type.startsWith('image/')) {
                        clipboardItem.getType(type).then(blob => {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                document.execCommand('insertImage', false, e.target.result);
                                if (this.currentNote) {
                                    this.currentNote.attachments++;
                                    this.updateNoteInList();
                                }
                            };
                            reader.readAsDataURL(blob);
                        });
                        return;
                    }
                }
            }
            this.showNotification('No image found in clipboard', 'error');
        }).catch(err => {
            console.error('Failed to read clipboard contents: ', err);
            this.showNotification('Failed to read clipboard contents', 'error');
        });
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        this.applyTheme();
        localStorage.setItem('darkTheme', this.isDarkTheme);
    }

    applyTheme() {
        if (this.isDarkTheme) {
            document.body.classList.add('dark-theme');
            this.themeToggle.innerHTML = '<i>☀️</i><span>Light Mode</span>';
        } else {
            document.body.classList.remove('dark-theme');
            this.themeToggle.innerHTML = '<i>🌙</i><span>Dark Mode</span>';
        }
    }

    toggleViewMode() {
        this.isListView = !this.isListView;
        this.notesGrid.classList.toggle('list-view', this.isListView);
        this.toggleView.innerHTML = this.isListView ? 
            '<i>⏹️</i><span>Grid View</span>' : 
            '<i>📋</i><span>List View</span>';
    }

    searchNotes(query) {
        const filteredNotes = this.notes.filter(note => 
            note.title.toLowerCase().includes(query.toLowerCase()) ||
            note.content.toLowerCase().includes(query.toLowerCase()) ||
            note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        
        this.renderNotes(filteredNotes);
    }

    renderFolders() {
        const foldersContainer = document.querySelector('.folders-section');
        const addFolderBtn = foldersContainer.querySelector('.add-folder-btn');
        
        // Clear existing folders (except the add button)
        const existingFolders = foldersContainer.querySelectorAll('.folder');
        existingFolders.forEach(folder => folder.remove());
        
        // Add folders
        this.folders.forEach(folder => {
            const folderElement = document.createElement('div');
            folderElement.className = 'folder';
            folderElement.dataset.folderId = folder.id;
            folderElement.innerHTML = `
                <i>${folder.icon}</i>
                <span>${folder.name}</span>
            `;
            
            if (this.currentFolder === folder.id) {
                folderElement.classList.add('active');
            }
            
            foldersContainer.insertBefore(folderElement, addFolderBtn);
        });
    }

    renderNotes(notesToRender = null) {
        const notes = notesToRender || this.getFilteredNotes();
        this.notesGrid.innerHTML = '';
        
        notes.forEach(note => {
            const folder = this.folders.find(f => f.id === note.folder);
            const noteElement = document.createElement('div');
            noteElement.className = 'note-card';
            noteElement.dataset.noteId = note.id;
            
            if (this.currentNote && this.currentNote.id === note.id) {
                noteElement.classList.add('active');
            }
            
            // Create preview text from content
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = note.content;
            const previewText = tempDiv.textContent.substring(0, 100) + '...';
            
            noteElement.innerHTML = `
                <div class="note-tag" style="background: ${folder ? folder.color : '#4361ee'}">${folder ? folder.name : 'Unknown'}</div>
                <h3>${note.title}</h3>
                <p>${previewText}</p>
                <div class="note-meta">
                    <span>${this.getRelativeTime(note.lastEdited)}</span>
                    <span>📎 ${note.attachments}</span>
                </div>
            `;
            
            this.notesGrid.appendChild(noteElement);
        });
    }

    getFilteredNotes() {
        if (this.currentFolder === 'all') {
            return this.notes;
        }
        return this.notes.filter(note => note.folder === this.currentFolder);
    }

    getRelativeTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        const minute = 60 * 1000;
        const hour = minute * 60;
        const day = hour * 24;
        const week = day * 7;
        const month = day * 30;
        const year = day * 365;
        
        if (diff < minute) return 'Just now';
        if (diff < hour) return Math.floor(diff / minute) + ' minutes ago';
        if (diff < day) return Math.floor(diff / hour) + ' hours ago';
        if (diff < week) return Math.floor(diff / day) + ' days ago';
        if (diff < month) return Math.floor(diff / week) + ' weeks ago';
        if (diff < year) return Math.floor(diff / month) + ' months ago';
        return Math.floor(diff / year) + ' years ago';
    }

    showNotification(message, type = 'success') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    saveToStorage() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
        localStorage.setItem('folders', JSON.stringify(this.folders));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.notesApp = new NotesApp();
});
