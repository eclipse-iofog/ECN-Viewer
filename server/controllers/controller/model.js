let controller = null

const get = () => controller
const set = (newController) => { controller = newController }

module.exports = {
  get,
  set
}
