import { Sequelize } from "sequelize";

const connectDB = async () => {
  const user = process.env.POSTGRES_USER as string;
  const password = process.env.POSTGRES_PASSWORD as string;
  const database = process.env.POSTGRES_DB as string;
  const sequelize = new Sequelize(database, user, password, {
    host: 'postgres-db',
    dialect: "postgres"
  });

  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the Database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};


export default connectDB;
