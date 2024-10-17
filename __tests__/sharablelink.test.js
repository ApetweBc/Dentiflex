import { generateSharableLink } from "@/Threejs/three";

describe('sharableLink', () => {
  let mockModel;
  let mockSharableLink;
  let toastMock;
 

  beforeEach(() => {
    // Reset mocks and globals before each test
    mockModel = {}; // Mock model object
    mockSharableLink = "http://localhost:3001/dental/encodedState";
    toastMock = { success: jest.fn(), error: jest.fn() };
    global.toast = toastMock;
    global.generatedLinkDiv = { innerHTML: '' };
    global.stlModel = mockModel;

    // Create button and add event listener
    const generateLinkButton = document.createElement('button');
    generateLinkButton.addEventListener("click", () => {
      if (!global.stlModel) {
        toast.error("No model loaded", {
          position: "top-left",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "colored",
          icon: false
        });
        return;
      }
      const sharableLink = generateSharableLink(global.stlModel);
      global.generatedLinkDiv.innerHTML = `<a href="${sharableLink}" target="_blank">${sharableLink}</a>`;
    });
    
    // Simulate a button click
    generateLinkButton.click();
  });

  // Clicking the button generates a sharable link when a model is loaded
  it.only('should generate a sharable link when a model is loaded', () => {
    const generateSharableLinkMock = jest.spyOn(global, 'generateSharableLink').mockReturnValue(mockSharableLink);
    
    this.generateLinkButton.click();

    expect(generateSharableLinkMock).toHaveBeenCalledWith(mockModel);
    expect(global.generatedLinkDiv.innerHTML).toContain(mockSharableLink);
  });

  // Clicking the button without a loaded model triggers an error toast
  it('should trigger an error toast when no model is loaded', () => {
    global.stlModel = null; // No model loaded

    this.generateLinkButton.click();

    expect(toastMock.error).toHaveBeenCalledWith("No model loaded", expect.any(Object));
  });
});
