# Bamazon

### Bamazon Customer
The Bamazon Customer application is used by customers to select the items and quantities they want to purchase of each product available. When the application starts the user is shown the list of products that are currently available. It show the item_id, product name, and the current price in a table format. The user will then be prompted to enter the item_id they wish to purchase and how many of the product they wish to purchase.
The appliaction will check that the item is an available product and if there is sufficient quantity in stock. The user is notified if either check fails. If both checks pass, the database is updated to reflect the new quantity in stock.
If the user enters 0 for the for the item_id and any quanity, the application will end.

### Bamazon Manager
The Bamazon Manager application allows the manager to maintain the products that are available. Once the application starts the user is prompted with five choices.
The first option is to **View Products**. Selecting this option will display a table showing each product available with its price and the quantity in stock.
The **View Low Inventory** option display the same type of information but only displays products that have less than 5 items in stock.
To increase a products stock the user would select **Add to Inventory**. All the products will first be displayed like the **View Products** option. The user is prompted to enter the item id and how much inventory will be added. The application will thencheck that the item id is valid. If the item id is not available the user will be notified that the product select is not currently available. If the item id is valid the quantity will be updated.
The **Add New Product** option allows the user to add an available product. When selected the user will be prompted for the product's id, name, unit price, and what department it belongs. THe product will then be added to the database.
The final option is **Exit** which end the application.

### Bamazon Supervisor
The Bamazon Supervisor appliaction is designed to allow a high view on how the departments are doing financially. It provide two main option. 
The first is to **View Product Sales by Department**. This option displays a table showing all the departments along with each departments over head costs, product sales, and total profits.
The second option is **Create New Department**. Then the user selects this option they are then prompted for the department's id, name, and over head cost. This information is then added to the database.
The final option is **Exit** which end the application.
