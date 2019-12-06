/** @format */

export const getRandomID = () => {
  return (Math.floor(Math.random() * 9000000000) + 1000000000).toString()
}
