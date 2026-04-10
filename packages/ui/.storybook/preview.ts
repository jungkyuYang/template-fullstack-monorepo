import "./preview.css";
import { definePreview } from "@storybook/react-vite";
import * as addonDocs from "@storybook/addon-docs/preview";

export default definePreview({
  addons: [addonDocs],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
});
