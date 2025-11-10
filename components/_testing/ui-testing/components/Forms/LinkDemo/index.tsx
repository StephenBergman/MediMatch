import { Link, LinkText } from "@/components/ui/link";
import React from "react";
import ComponentSnippet from "../../ComponentSnippet";

const LinkDemo = () => {
  return (
    <ComponentSnippet
      title="Link"
      example={
        <Link isDisabled={false} href="" isExternal>
          <LinkText>Link Text</LinkText>
        </Link>
      }
      snippet="gs-LinkBasicLink"
      warnings={
        "Should be used only for external links, with `isExternal`. Navigation should be handled with expo-router."
      }
    />
  );
};

export default LinkDemo;
