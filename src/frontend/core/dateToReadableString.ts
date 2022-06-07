export default (dateString: string) => {
    const date = new Date(dateString);
    const hour = date.getHours().toString().length === 1 ? "0"+date.getHours() : date.getHours()
    const min = date.getMinutes().toString().length === 1 ? "0"+date.getMinutes() : date.getMinutes()
    const day = date.getDate().toString().length === 1 ? "0"+date.getDate() : date.getDate()
    const month = (date.getMonth()+1).toString().length === 1 ? "0"+(date.getMonth()+1) : date.getMonth()+1
    return `${hour}:${min} ${day}.${month}.${date.getFullYear()}`
  }