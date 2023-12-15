-------------------------------------
-- USERS-----------------------------
-------------------------------------

-- PRODUCERS USERS
insert into users (id, email, first_name, last_name, phone)
values (1000, 'claude.nougaro@address.mail', 'Claude', 'NOUGARO', '0601020304');

insert into users (id, email, first_name, last_name, phone)
values (2000, 'georges.brassens@address.mail', 'Georges', 'BRASSENS', '0102030405');

-- CUSTOMERS USERS
insert into users (id, email, first_name, last_name, phone)
values (3000, 'mark.knopfler@address.mail', 'Mark', 'KNOPFLER', '0304050607');

insert into users (id, email, first_name, last_name, phone)
values (4000, 'freddy.mercury@address.mail', 'Freddy', 'MERCURY', '0305060708');

insert into users (id, email, first_name, last_name, phone)
values (5000, 'beth.gibbons@address.mail', 'Beth', 'GIBBONS', '0302010908');


-------------------------------------
-- PRODUCERS ------------------------
-------------------------------------

insert into producers (id, user_id)
values (1000, 1000);

insert into producers (id, user_id)
values (2000, 2000);

-------------------------------------
-- CUSTOMERS ------------------------
-------------------------------------

insert into customers (id, user_id)
values (3000, 3000);

insert into customers (id, user_id)
values (4000, 4000);

insert into customers (id, user_id)
values (5000, 5000);


-------------------------------------
-- ADDRESSES ------------------------
-------------------------------------

insert into addresses (id, name, address_line1, address_line2, city, zip_code, owner_id)
values (1000, 'Toulouse Centre', 'Place du Capitole', null, 'Toulouse', '31000', 1000);

insert into addresses (id, name, address_line1, address_line2, city, zip_code, owner_id)
values (1001, 'Toulouse Mirail', '1 avenue Miterrand', 'parking du supermarché', 'Toulouse', '31000', 1000);

insert into addresses (id, name, address_line1, address_line2, city, zip_code, owner_id)
values (2000, 'Port de Sète', '1 rue du port', null, 'Sète', '34200', 2000);


-------------------------------------
-- PACKAGE TEMPLATES ----------------
-------------------------------------

insert into package_templates (id, description, label, net_weight, unit_price)
values (1000, 'Un coli avec un peu de tout', 'Le coli tradition', 10, 16);

insert into package_templates (id, description, label, net_weight, unit_price)
values (1001, 'Un coli avec une majorité de steaks', 'Le coli cuisson rapide', 10, 16);

-------------------------------------
-- PRODUCTIONS AND PACKAGES ---------
-------------------------------------

insert into beef_productions (id, production_type, producer_id, animal_identifier, animal_live_weight, animal_type, birth_date, birth_place, slaughter_date)
values (1000, 1, 1000, '1234', '400', null, '2022-01-13T00:00:00.000', 'Béchy', '2023-12-25 00:00:00.000');
insert into package_lots (id, description, label, net_weight, photo, quantity, quantity_sold, unit_price, production_id)
values (10000, 'Un coli avec un peu de tout', 'Le coli tradition', 10, null, 10, 2, 16, 1000);
insert into package_lots (id, description, label, net_weight, photo, quantity, quantity_sold, unit_price, production_id)
values (10001, 'Un coli avec une majorité de steaks', 'Le coli cuisson rapide', 7, null, 10, 3, 16, 1000);

insert into beef_productions (id, production_type, producer_id, animal_identifier, animal_live_weight, animal_type, birth_date, birth_place, slaughter_date)
values (1001, 1, 1000, '2345', '350', null, '2020-02-13T00:00:00.000', 'Béchy', '2023-11-03 00:00:00.000');
insert into package_lots (id, description, label, net_weight, photo, quantity, quantity_sold, unit_price, production_id)
values (10010, 'Un coli avec un peu de tout', 'Le coli tradition', 10, null, 12, 2, 16, 1001);
insert into package_lots (id, description, label, net_weight, photo, quantity, quantity_sold, unit_price, production_id)
values (10011, 'Un coli avec une majorité de steaks', 'Le coli cuisson rapide', 9, null, 10, 7, 16, 1001);

insert into beef_productions (id, production_type, producer_id, animal_identifier, animal_live_weight, animal_type, birth_date, birth_place, slaughter_date)
values (2000, 1, 2000, '3456', '450', null, '2021-03-15T00:00:00.000', 'Gruffy', '2024-01-05 00:00:00.000');
insert into package_lots (id, description, label, net_weight, photo, quantity, quantity_sold, unit_price, production_id)
values (20000, 'Un coli avec un peu de tout', 'Le coli tradition', 10, null, 7, 1, 16, 2000);
insert into package_lots (id, description, label, net_weight, photo, quantity, quantity_sold, unit_price, production_id)
values (20001, 'Un coli avec que des steaks', 'Le petit coli steak', 5, null, 11, 0, 18, 2000);


-------------------------------------
-- SALES ----------------------------
-------------------------------------

insert into sales (id, delivery_address_line1, delivery_address_line2, delivery_address_name, delivery_city, delivery_start, delivery_stop, delivery_zip_code)
values (1000, '1 place de la République', null, 'Metz Centre', 'Metz', '2023-12-10 17:00', '2023-12-10 18:00', '57000');
insert into sales_productions (sales_id, productions_id)
values (1000, 1000);

insert into sales (id, delivery_address_line1, delivery_address_line2, delivery_address_name, delivery_city, delivery_start, delivery_stop, delivery_zip_code)
values (2000, '5 rue de l''église', 'derrière le présbytère', 'Peltre', 'Peltre', '2023-20-10 11:00', '2023-20-10 12:00', '57999');
insert into sales_productions (sales_id, productions_id)
values (2000, 2000);


-------------------------------------
-- ORDERS ---------------------------
-------------------------------------

insert into orders (id, customer_id, invoice_id, sale_id)
values (3000, 3000, null, 1000);
insert into order_items (id, quantity, unit_price, order_id, package_lot_id)
values (3000, 1, 16, 3000, 10000);

insert into orders (id, customer_id, invoice_id, sale_id)
values (4000, 4000, null, 1000);
insert into order_items (id, quantity, unit_price, order_id, package_lot_id)
values (4000, 1, 16, 4000, 20000);
