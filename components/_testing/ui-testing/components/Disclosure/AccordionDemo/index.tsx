import {
  Accordion,
  AccordionContent,
  AccordionContentText,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Divider } from '@/components/ui/divider';
import { ChevronDownIcon, ChevronUpIcon } from '@/components/ui/icon';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const AccordionDemo = () => {
  return (
    <ComponentSnippet
      title="Accordion"
      example={
        <Accordion
          size="md"
          variant="filled"
          type="single"
          isCollapsible={true}
          isDisabled={false}
          className="m-5 w-auto border border-outline-200"
        >
          <AccordionItem value="a">
            <AccordionHeader>
              <AccordionTrigger>
                {({ isExpanded }) => {
                  return (
                    <>
                      <AccordionTitleText>How do I place an order?</AccordionTitleText>
                      {isExpanded ? (
                        <AccordionIcon as={ChevronUpIcon} className="ml-3" />
                      ) : (
                        <AccordionIcon as={ChevronDownIcon} className="ml-3" />
                      )}
                    </>
                  );
                }}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>
              <AccordionContentText>
                To place an order, simply select the products you want, proceed to checkout, provide
                shipping and payment information, and finalize your purchase.
              </AccordionContentText>
            </AccordionContent>
          </AccordionItem>
          <Divider />
          <AccordionItem value="b">
            <AccordionHeader>
              <AccordionTrigger>
                {({ isExpanded }) => {
                  return (
                    <>
                      <AccordionTitleText>What payment methods do you accept?</AccordionTitleText>
                      {isExpanded ? (
                        <AccordionIcon as={ChevronUpIcon} className="ml-3" />
                      ) : (
                        <AccordionIcon as={ChevronDownIcon} className="ml-3" />
                      )}
                    </>
                  );
                }}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>
              <AccordionContentText>
                We accept all major credit cards, including Visa, Mastercard, and American Express.
                We also support payments through PayPal.
              </AccordionContentText>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      }
      snippet="gs-AccordionBasicAccordion"
    />
  );
};

export default AccordionDemo;
