import { SDK } from '../../../hitl/src/backend'

export default class Database {
  knex: any

  constructor(private bp: SDK) {
    this.knex = bp.database
  }

  initialize() {
    if (!this.knex) {
      throw new Error('You must initialize the database before')
    }

    this.knex.createTableIfNotExists('my_module_db', table => {
      table.increments('id')
      table.string('name')
      table.string('value')
    })
  }
}
