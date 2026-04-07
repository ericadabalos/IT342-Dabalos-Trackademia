// Creational Design Pattern
export const LogFactory = {
  createLog: (action, taskTitle) => {
    const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const id = Date.now();

    switch (action) {
      case "COMPLETE":
        return { id, text: `${taskTitle} marked as done`, time, type: "complete" };
      case "ADD":
        return { id, text: `New task added: ${taskTitle}`, time, type: "add" };
      case "DELETE":
        return { id, text: `Deleted: ${taskTitle}`, time, type: "delete" };
      case "AUTH":
        return { id, text: `Logged into Trackademia`, time, type: "auth" };
      default:
        return { id, text: `System action: ${taskTitle}`, time, type: "default" };
    }
  }
};