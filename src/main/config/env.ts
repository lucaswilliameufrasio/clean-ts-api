export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/clean-node-api',
  port: process.env.PORT || 7777,
  jwtSecret: process.env.JWT_SECRET || '&~/n;PQV{a/_&..O"KT7'
}
