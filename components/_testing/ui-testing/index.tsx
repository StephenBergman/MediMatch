import { Heading } from "@/components/ui/heading";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import { Platform } from "react-native";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";

//Demo Components
import BadgeDemo from "./components/DataDisplay/BadgeDemo";
import CardDemo from "./components/DataDisplay/CardDemo";
import TableDemo from "./components/DataDisplay/TableDemo";
import AccordionDemo from "./components/Disclosure/AccordionDemo";
import ActionSheetDemo from "./components/Disclosure/ActionSheetDemo.tsx";
import BottomSheetDemo from "./components/Disclosure/BottomSheetDemo";
import AlertDemo from "./components/Feedback/AlertDemo";
import ProgressDemo from "./components/Feedback/ProgressDemo";
import SpinnerDemo from "./components/Feedback/SpinnerDemo";
import ToastDemo from "./components/Feedback/ToastDemo";
import ButtonDemo from "./components/Forms/ButtonDemo";
import CheckboxDemo from "./components/Forms/CheckboxDemo";
import FormControlDemo from "./components/Forms/FormControlDemo";
import InputDemo from "./components/Forms/InputDemo";
import LinkDemo from "./components/Forms/LinkDemo";
import PressableDemo from "./components/Forms/PressableDemo";
import RadioDemo from "./components/Forms/RadioDemo";
import SelectDemo from "./components/Forms/SelectDemo";
import SliderDemo from "./components/Forms/SliderDemo";
import SwitchDemo from "./components/Forms/SwitchDemo";
import TextareaDemo from "./components/Forms/TextareaDemo";
import BoxDemo from "./components/Layout/BoxDemo";
import CenterDemo from "./components/Layout/CenterDemo";
import DividerDemo from "./components/Layout/DividerDemo";
import GridDemo from "./components/Layout/GridDemo";
import HStackDemo from "./components/Layout/HStackDemo";
import VStackDemo from "./components/Layout/VStackDemo";
import AvatarDemo from "./components/MediaAndIcons/AvatarDemo";
import IconDemo from "./components/MediaAndIcons/IconDemo";
import ImageDemo from "./components/MediaAndIcons/ImageDemo";
import FabDemo from "./components/Others/FabDemo";
import SkeletonDemo from "./components/Others/SkeletonDemo";
import AlertDialogDemo from "./components/Overlay/AlertDialogDemo";
import DrawerDemo from "./components/Overlay/DrawerDemo";
import MenuDemo from "./components/Overlay/MenuDemo";
import ModalDemo from "./components/Overlay/ModalDemo";
import PopoverDemo from "./components/Overlay/PopoverDemo";
import PortalDemo from "./components/Overlay/PortalDemo";
import TooltipDemo from "./components/Overlay/TooltipDemo";
import SectionHeading from "./components/SectionHeading";
import HeadingDemo from "./components/Typography/HeadingDemo";
import TextDemo from "./components/Typography/TextDemo";

const tocSections = [
  {
    label: "Typography",
    anchor: "typography",
  },
  {
    label: "Layout",
    anchor: "layout",
  },
  {
    label: "Feedback",
    anchor: "feedback",
  },
  {
    label: "Data Display",
    anchor: "data-display",
  },
  {
    label: "Forms",
    anchor: "forms",
  },
  {
    label: "Overlay",
    anchor: "overlay",
  },
  {
    label: "Disclosure",
    anchor: "disclosure",
  },
  {
    label: "Media and Icons",
    anchor: "media-and-icons",
  },
  {
    label: "Others",
    anchor: "others",
  },
];

const UITesting = () => {
  return (
    <VStack className="w-full" space={"md"}>
      <SectionHeading
        id="top"
        title="Gluestack UI Components Kitchen Sink"
        notes="This screen is for testing and showcasing various UI components from Gluestack UI, and
        serves as a reference point for usage patterns, props, and cross-platform compatibility."
      />

      {/* Table of Contents in Accordion */}
      {Platform.OS === "web" && (
        <Accordion type="single" className="mb-4 rounded-2xl">
          <AccordionItem value="toc">
            <AccordionHeader>
              <AccordionTrigger>
                <Heading size="lg">Table of Contents</Heading>
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>
              <VStack space="xs" className="mb-6">
                {tocSections.map((section) => (
                  <Pressable
                    key={section.anchor}
                    onPress={() => {
                      const el = document.getElementById(section.anchor);
                      if (el) {
                        el.scrollIntoView({
                          behavior: "smooth",
                        });
                      }
                    }}
                    className="w-fit"
                  >
                    <Text className="cursor-pointer text-primary-600 underline">
                      {section.label}
                    </Text>
                  </Pressable>
                ))}
              </VStack>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      <SectionHeading id="typography" title="Typography" />
      <HeadingDemo />
      <TextDemo />

      <SectionHeading id="layout" title="Layout" />
      <BoxDemo />
      <CenterDemo />
      <DividerDemo />
      <HStackDemo />
      <VStackDemo />
      <GridDemo />

      <SectionHeading id="feedback" title="Feedback" />
      <AlertDemo />
      <ProgressDemo />
      <SpinnerDemo />
      <ToastDemo />

      <SectionHeading id="data-display" title="Data Display" />
      <BadgeDemo />
      <CardDemo />
      <TableDemo />

      <SectionHeading id="forms" title="Forms" />
      <ButtonDemo />
      <CheckboxDemo />
      <FormControlDemo />
      <InputDemo />
      <LinkDemo />
      <PressableDemo />
      <RadioDemo />
      <SelectDemo />
      <SliderDemo />
      <SwitchDemo />
      <TextareaDemo />

      <SectionHeading id="overlay" title="Overlay" />
      <AlertDialogDemo />
      <DrawerDemo />
      <MenuDemo />
      <ModalDemo />
      <PopoverDemo />
      <PortalDemo />
      <TooltipDemo />

      <SectionHeading id="disclosure" title="Disclosure" />
      <ActionSheetDemo />
      <AccordionDemo />
      <BottomSheetDemo />

      <SectionHeading id="media-and-icons" title="Media and Icons" />
      <AvatarDemo />
      <ImageDemo />
      <IconDemo />

      <SectionHeading id="others" title="Others" />
      <FabDemo />
      <SkeletonDemo />
    </VStack>
  );
};
export default UITesting;
