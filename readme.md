
<!-- for generate migration -->
npx sequelize-cli migration:generate --name users-table

<!-- for migrate table in DB -->
npx sequelize-cli db:migrate --to 20251117121500-create-shout-out.js


<!-- for migrate multiple table in DB -->
npx sequelize-cli db:migrate