insert into beef_productions (id, production_type, producer_id, animal_identifier, animal_live_weight, animal_type, birth_date, birth_place, slaughter_date)
values (1000, 1, 1000, '1234', '400', null, '2022-01-13T00:00:00.000', 'Béchy', '2023-12-25 00:00:00.000');
insert into package_lots (id, description, label, net_weight, photo, quantity, quantity_sold, unit_price, production_id)
values (10000, 'Un coli avec un peu de tout', 'Le coli tradition', 10, null, 10, 2, 16, 1000);
insert into package_lots (id, description, label, net_weight, photo, quantity, quantity_sold, unit_price, production_id)
values (10001, 'Un coli avec une majorité de steaks', 'Le coli cuisson rapide', 10, null, 10, 8, 16, 1000);


insert into beef_productions (id, production_type, producer_id, animal_identifier, animal_live_weight, animal_type, birth_date, birth_place, slaughter_date)
values (1001, 1, 1000, '2345', '350', null, '2020-02-13T00:00:00.000', 'Béchy', '2023-11-03 00:00:00.000');
insert into package_lots (id, description, label, net_weight, photo, quantity, quantity_sold, unit_price, production_id)
values (10010, 'Un coli avec un peu de tout', 'Le coli tradition', 10, null, 10, 2, 16, 1001);
insert into package_lots (id, description, label, net_weight, photo, quantity, quantity_sold, unit_price, production_id)
values (10011, 'Un coli avec une majorité de steaks', 'Le coli cuisson rapide', 10, null, 10, 8, 16, 1001);

insert into beef_productions (id, production_type, producer_id, animal_identifier, animal_live_weight, animal_type, birth_date, birth_place, slaughter_date)
values (2000, 1, 2000, '3456', '450', null, '2021-03-15T00:00:00.000', 'Gruffy', '2024-01-05 00:00:00.000');
insert into package_lots (id, description, label, net_weight, photo, quantity, quantity_sold, unit_price, production_id)
values (20000, 'Un coli avec un peu de tout', 'Le coli tradition', 10, null, 10, 2, 16, 2000);
insert into package_lots (id, description, label, net_weight, photo, quantity, quantity_sold, unit_price, production_id)
values (20001, 'Un coli avec que des steaks', 'Le petit coli steak', 5, null, 10, 8, 18, 2000);
