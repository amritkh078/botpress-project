/**
 * @title Custom Action
 * @category Custom Module
 * @author Amrit, Inc.
 */

try {
  const message = {
    type: 'text',
    text: 'Hello World!',
    markdown: true
  }

  return bp.events.replyToEvent(event, [message])

} catch (error) {
  bp.logger.info(error)
}