export const fetchAutomationState = async (): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://gmedia-leads-panel.uc.r.appspot.com/api/automatic-status`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch automation state");
    }

    const data = await response.json();
    console.log(data);
    return data.isEnabled;
  } catch (error) {
    console.error("Error fetching automation state:", error);
    return false;
  }
};

export const updateAutomationState = async (
  newState: boolean
): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://gmedia-leads-panel.uc.r.appspot.com/api/toggle-automatic`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isEnabled: newState }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update automation state");
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error updating automation state:", error);
    return false;
  }
};
