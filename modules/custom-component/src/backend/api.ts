import axios from 'axios'
import * as sdk from 'botpress/sdk'

export default async (bp: typeof sdk) => {
  /**
   * This is an example route to get you started.
   * Your API will be available at `http://localhost:3000/api/v1/bots/BOT_NAME/mod/custom-component`
   * Just replace BOT_NAME by your bot ID
   */

  /**
   * Accessing config file
   * const config = (await bp.config.mergeBotConfig(botId, {})).config
   */
  const router = bp.http.createRouterForBot('custom-component', { checkAuthentication: false })

  // Link to access this route: http://localhost:3000/api/v1/bots/BOT_NAME/mod/custom-component/test-end-point
  router.post('/test-end-point', async (req, res) => {
    const { botId } = req.params
    const { endpoint, inputValues } = req.body

    const config = (await bp.config.mergeBotConfig(botId, {})).form_header
    try {
      await axios.post(
        endpoint,
        { inputValues },
        {
          headers: { auth_token: config.auth_token }
        }
      )
    } catch (error) {
      console.error(error)
      res.status(500).send('Internal server error')
    }
  })
}
