﻿//computes makeup of languages used to solve eulers
//based on file type
//called by index.js

require('ansi-colors');
const fs = require('fs');
const path = require('path');
const extensions = {
    '.c': 'C',                 // C source code
    '.h': 'C',                 // C header file
    '.cpp': 'C++',             // C++ source code
    '.cc': 'C++',              // C++ source code
    '.cxx': 'C++',             // C++ source code
    '.java': 'Java',           // Java source code
    '.class': 'Java',          // Java compiled bytecode
    '.jar': 'Java',            // Java executable archive
    '.py': 'Python',           // Python source code
    '.pyw': 'Python',          // Python GUI application
    '.js': 'JavaScript',       // JavaScript source code
    '.json': 'JSON',           // JSON data file
    '.html': 'HTML',           // HTML markup
    '.htm': 'HTML',            // HTML markup
    '.css': 'CSS',             // CSS stylesheet
    '.php': 'PHP',             // PHP source code
    '.rb': 'Ruby',             // Ruby source code
    '.swift': 'Swift',         // Swift source code
    '.go': 'Go',               // Go source code
    '.R': 'R',                 // R source code
    '.r': 'R',                 // R source code
    '.sql': 'SQL',             // SQL script
    '.kt': 'Kotlin',           // Kotlin source code
    '.rs': 'Rust',             // Rust source code
    '.pl': 'Perl',             // Perl source code
    '.pm': 'Perl',             // Perl module
    '.ts': 'TypeScript',       // TypeScript source code
    '.cs': 'Csharp',           // C# source code
    '.scala': 'Scala',         // Scala source code
    '.hs': 'Haskell',          // Haskell source code
    '.lua': 'Lua',             // Lua source code
    '.dart': 'Dart',           // Dart source code
    '.m': 'Objective-C',       // Objective-C source code
    '.sh': 'Shell',            // Shell script
    '.bat': 'Batch',           // Batch script
    '.ps1': 'Powershell'       // PowerShell script
};

function computeEulersFolder() {
    const folderPath = path.resolve(__dirname, '..', 'eulers');
    let metrics = [{
        eulerCount: 0,
        langFileCount: 0,
        langCount: 0,
        lang: '',
        fileCount: 0,
        users: ''
    }];
    
    try {
        metrics = tryGetFolderContents(folderPath, metrics);
        metrics[0].totalLangCount = metrics.length - 1;
        metrics[0].totalFileCount = metrics.reduce((accumulator, item) => {
            return accumulator + item.fileCount;
        }, 0);
        metrics.sort((a, b) => b.fileCount - a.fileCount);
        
        console.log(`!!THERE HAVE BEEN ${metrics[metrics.length - 1].eulerCount} EULER PROBLEMS SOLVED IN ${metrics.length - 1} DIFFERENT LANGUAGES!!`);
        console.log("!!CAN YOU COMPLETE A EULER IN A NEW LANGUAGE?!!");
        console.log();
        console.log("    Below: # of files per language used to solve Euler problems,");
        console.log("           + the users who used that language and how many times they used it:");
        console.log();
        for (let i = 0; i < metrics.length - 1; ++i) {
            console.log(`${metrics[i].fileCount} ${metrics[i].lang} files - users: ${metrics[i].users}`);
        }
        
    } catch (err) {
        console.error('Error:', err);
    }
}

function tryGetFolderContents(folderPath, metrics) {
    const folderContents = fs.readdirSync(folderPath);

    folderContents.forEach((item) => {
        if (path.basename(folderPath).toLowerCase().startsWith('e') && !isNaN(parseInt(path.basename(folderPath)[1]))) {
            metrics[0].eulerCount++;
        }
        const itemPath = path.join(folderPath, item);
        
        if (fs.statSync(itemPath).isDirectory()){
            tryGetFolderContents(itemPath, metrics);
        } else {
            const fileExtension = path.extname(itemPath).toLowerCase();
            const pathPieces = itemPath.split('\\');
            const username = pathPieces[pathPieces.length - 2];

            if (extensions[fileExtension]) {
                if (pathPieces[pathPieces.length - 4].toLowerCase().startsWith('e')) {
                    if (metrics.some(item => item.lang.toLowerCase() === extensions[fileExtension].toLowerCase())) {
                        metrics.forEach(item => {
                            if (item.lang === extensions[fileExtension]) {
                                item.fileCount++;
                                if (!item.users.includes(username)) {
                                    item.users += `, ${username} 1`;
                                } else {
                                    let users = item.users.split(',').map(user => user.trim());
                                    let foundUser = users.find(user => user.trim().split(' ')[0].startsWith(username));
                                    let ui = users.indexOf(foundUser);
                                    users[ui] = ` ${username} ${parseInt(foundUser.trim().split(' ')[1]) + 1}`;
                                    item.users = users.toString();
                                }
                            }
                        });
                    } else {
                        metrics.push({lang: extensions[fileExtension], fileCount: 1, users: `${username} 1`});
                    }
                }
            }
        }
    });
    return metrics;
}

module.exports = {
    computeEulersFolder,
}