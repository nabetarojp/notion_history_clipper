// Function to download Notion updates as a text file
function downloadNotionUpdates() {
    const updatesSection = document.querySelector('#notion-app > div > div:nth-child(1) > div > div:nth-child(10) > aside > div > div > div > div.notion-scroller.vertical > div:nth-child(2) > div > div > section');
    if (updatesSection) {
        const updates = Array.from(updatesSection.querySelectorAll('article')).map(article => {
            const header = article.querySelector('.notion-activity-section-header span').innerText;
            const time = article.querySelector('.notion-activity-section-time div').innerText;
            const childrenElements = article.querySelectorAll('.notion-activity-section-children > div');

            // カテゴリごとにテキストを収集して重複を排除する
            const categories = {};
            Array.from(childrenElements).forEach(child => {
                if (child && child.innerText) {
                    const text = child.innerText.trim();
                    if (text) {
                        const categoryElement = child.closest('.notion-activity-section-children').previousElementSibling.querySelector('div > div > div');
                        const category = categoryElement ? categoryElement.innerText.trim() : 'その他';
                        if (!categories[category]) {
                            categories[category] = new Set();
                        }
                        categories[category].add(text);
                    }
                }
            });

            // カテゴリごとにテキストを結合し、スペースで区切る
            const childrenTextArray = [];
            for (const [category, texts] of Object.entries(categories)) {
                const joinedTexts = Array.from(texts).join(' ');
                childrenTextArray.push(`${category} ${joinedTexts}`);
            }
            const childrenText = childrenTextArray.join(' ');

            return `"${header.replace(/"/g, '""')}", "${time.replace(/"/g, '""')}", "${childrenText.replace(/\n/g, ' ').replace(/"/g, '""')}"`;
        });
        const csvContent = updates.join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'notion-history.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('Updates downloaded as csv file successfully.');
    } else {
        console.log('Updates section not found');
    }
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'download_updates') {
        downloadNotionUpdates();
        sendResponse({status: 'success'});
    }
});
