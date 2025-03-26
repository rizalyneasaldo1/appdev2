const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const EventEmitter = require('events');

//Log using EventMitter
const eventEmitter = new EventEmitter();

const port = 3000;

// Log events when files created
eventEmitter.on('fileCreated', (filename) => {
    console.log(`File Created: ${filename}`);
});

// Log events when files read
eventEmitter.on('fileRead', (filename) => {
    console.log(`File Read: ${filename}`);
});

// Log events when files updated
eventEmitter.on('fileUpdated', (filename) => {
    console.log(`File Content Updated: ${filename}`);
});

// Log events when files deleted
eventEmitter.on('fileDeleted', (filename) => {
    console.log(`File Deleted: ${filename}`);
});

// Create an HTTP server
const server = http.createServer((req, res) => {
    const { pathname, query } = url.parse(req.url, true);

    // Handle file paths across different routes
    if (pathname === '/create' && req.method === 'GET') {
        const filename = query.filename;
        const content = query.content || 'This is a new file.';
        const filePath = path.join(__dirname, filename);

        //Handle file creating operations
        fs.writeFile(filePath, content, (err) => {
            if (err) {
                res.statusCode = 500;
                res.end('Error creating file');
                return;
            }
            eventEmitter.emit('fileCreated', filename);
            res.statusCode = 200;
            res.end(`File named "${filename}" created successfully.`);
        });
    } 
    else if (pathname === '/read' && req.method === 'GET') {
        const filename = query.filename;
        const filePath = path.join(__dirname, filename);

        //Handle file reading operations
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 404;
                res.end('File not found');
                return;
            }
            eventEmitter.emit('fileRead', filename);
            res.statusCode = 200;
            res.end(`File Name : ${filename} \nContent : ${data}`);
        });
    } 
    else if (pathname === '/update' && req.method === 'GET') {
        const filename = query.filename;
        const content = query.content;
        const filePath = path.join(__dirname, filename);

        //Handle file updating operations
        fs.appendFile(filePath, content, (err) => {
            if (err) {
                res.statusCode = 500;
                res.end('Error updating file');
                return;
            }
            eventEmitter.emit('fileUpdated', filename);
            res.statusCode = 200;
            res.end(`File "${filename}" content updated successfully.`);
        });
    } 
    else if (pathname === '/delete' && req.method === 'GET') {
        const filename = query.filename;
        const filePath = path.join(__dirname, filename);

        //Handle file deleting operations
        fs.unlink(filePath, (err) => {
            if (err) {
                res.statusCode = 500;
                res.end('Error deleting file');
                return;
            }
            eventEmitter.emit('fileDeleted', filename);
            res.statusCode = 200;
            res.end(`File named "${filename}" deleted successfully.`);
        });
    } 
    else {
        res.statusCode = 404;
        res.end('Route not found');
    }
});

// Start server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
