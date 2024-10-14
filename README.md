# Foreclosures-FE
Built with GraphQL (Apollo), TS and React. This app helps me do research and keep notes for foreclosure listings in my area. Here are some key features this code does:
1) Updates listings that are new or canceled listings from an upstream source so I know when I need to do research or if a listing is no longer active.
2) Keeps a todo list styled finance section for updating other debts like other mortgages and other leins like a builders lein or utilities. This also can record back tax information.
3) Takes financial data and estimated value of house to highlight rows with different colors based on the potential of a good investment.
4) Is able to send a request to the backend to search other county documents for data needed. Listings only provide a sale date and case number. This code uses the case number to do lookups for getting the address of the property and judgment ( the debt being sued for ). Uses playwright-go lib for Chrome automation to intercept PDF displayed in browser, creates RAMdisk to save PDF, converts to images to be processed by an OCR then RegEx the parsed text to attempt to find values, which is second handedly verified by AI Chat Models. Looking to do this and have Chat automatically update RexEx lookups to refine the process since it is less resource intensive.


The server is written in Go / Fiber with MongoDB to handle user accounts for lookups, a self developed JWT handler that can expire tokens (oddly, it seems removing tokens programically is not something easily done with the libraries I was looking into with Go / Fiber, there are also other plans to detect when a r_token is used, but the old a_token was used to report suspicious activity ).

This communicates with the browser with Gql ( GraphQL ). Also utilizes WebSocket communication for informing users for doing Case Number to Address & Judgment lookups to report the progress in the automated browser to browser so we know where the headless browser running automation is at in progress. This was deployed on a VPS 1GB RAM so this also reports the que, so I do not run OOM; other more plentiful systems can run these tasks in parallel.


This code for FE may not be as up to date as extensively as mentioned here.
