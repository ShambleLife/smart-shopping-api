Mock Grocery Data

This is a simple grocery price mock-up repository, designed to simulate real-world grocery store scraping for testing and development purposes.

It contains hardcoded HTML files for three stores:
	•	Kroger (groceries.html)
	•	Publix (pub.html)
	•	Whole Foods (wf.html)

   How to Set Up and Run
	1.	Clone the Repository
        git clone https://github.com?ShambleLife/mock-grocery-data.git
        cd mock-grocery-data

    2.	Deploy with GitHub Pages (recommended)
	•	Go to your GitHub repository settings.
	•	Scroll down to Pages.
	•	Set Source to main branch, / (root).
	•	GitHub will give you a live URL like https://your-username.github.io/mock-grocery-data/.

    3.	Access the mock HTML pages:
	•	https://your-username.github.io/mock-grocery-data/groceries.html
	•	https://your-username.github.io/mock-grocery-data/pub.html
	•	https://your-username.github.io/mock-grocery-data/wf.html

    4.	Fetch the data in your project
	•	Use fetch() calls to scrape these HTML files as if they were real webpages!

    Key Features
	•	Provides fake grocery pricing data for testing shopping apps.
	•	Simulates data for multiple stores (Kroger, Publix, Whole Foods).
	•	Structured for easy scraping using JavaScript.
	•	No API key or server required — pure static HTML.

    Dependencies
	•	None.
    (It’s just static HTML. Your main project will need fetch() to scrape and parse it.)

    Important Notes
	•	This repository is static-only.
	•	To “scrape” the files, your frontend needs to fetch the page and manually parse the HTML.
	•	Ideal for mock tests, project demos, or front-end API simulation.

    Example Use Case

    In your app:

    javascript
    const response = await fetch('https://your-username.github.io/mock-grocery-data/groceries.html');
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const items = Array.from(doc.querySelectorAll('#grocery-list li')).map(li => ({
    name: li.querySelector('.item-name')?.textContent.trim(),
    price: parseFloat(li.querySelector('.item-price')?.textContent.replace('$', '')) || 0
    }));
    console.log(items);
