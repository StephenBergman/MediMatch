import { Badge, BadgeText } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { Platform, ScrollView } from "react-native";
import ComponentSnippet from "../../ComponentSnippet";

const TableDemo = () => {
  return (
    <ComponentSnippet
      title="Table"
      snippet="gs-TableBasic"
      example={
        <ScrollView
          horizontal
          contentContainerStyle={{
            flexGrow: 1,
          }}
          className="w-full"
        >
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Order id</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Order price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableData>571</TableData>
                <TableData>3</TableData>
                <TableData>Rajesh Kumar</TableData>
                <TableData>New Jersey</TableData>
                <TableData>$ 200</TableData>
                <TableData>
                  <Badge
                    size="sm"
                    action="success"
                    className="w-fit justify-center"
                  >
                    <BadgeText>Completed</BadgeText>
                  </Badge>
                </TableData>
              </TableRow>
              <TableRow>
                <TableData>5231</TableData>
                <TableData>2</TableData>
                <TableData>Priya Sharma</TableData>
                <TableData>Austin</TableData>
                <TableData>$ 150</TableData>
                <TableData>
                  <Badge
                    size="sm"
                    action="info"
                    className="w-fit justify-center"
                  >
                    <BadgeText>Processing</BadgeText>
                  </Badge>
                </TableData>
              </TableRow>
              <TableRow>
                <TableData>5771</TableData>
                <TableData>3</TableData>
                <TableData>Ravi Patel</TableData>
                <TableData>Seattle</TableData>
                <TableData>$ 215</TableData>
                <TableData>
                  <Badge
                    size="sm"
                    action="warning"
                    className="w-fit justify-center"
                  >
                    <BadgeText>Shipped</BadgeText>
                  </Badge>
                </TableData>
              </TableRow>
              <TableRow>
                <TableData>5231</TableData>
                <TableData>4</TableData>
                <TableData>Ananya Gupta</TableData>
                <TableData>California</TableData>
                <TableData>$ 88</TableData>
                <TableData>
                  <Badge
                    size="sm"
                    action="info"
                    className="w-fit justify-center"
                  >
                    <BadgeText>Processing</BadgeText>
                  </Badge>
                </TableData>
              </TableRow>
              <TableRow>
                <TableData>5771</TableData>
                <TableData>3</TableData>
                <TableData>Arjun Singh</TableData>
                <TableData>Seattle</TableData>
                <TableData>$ 115</TableData>
                <TableData>
                  <Badge
                    size="sm"
                    action="info"
                    className="w-fit justify-center"
                  >
                    <BadgeText>Processing</BadgeText>
                  </Badge>
                </TableData>
              </TableRow>
              <TableRow>
                <TableData>5771</TableData>
                <TableData>3</TableData>
                <TableData>Nisha Verma</TableData>
                <TableData>Austin</TableData>
                <TableData>$ 115</TableData>
                <TableData>
                  <Badge
                    size="sm"
                    action="success"
                    className="w-fit justify-center"
                  >
                    <BadgeText>Completed</BadgeText>
                  </Badge>
                </TableData>
              </TableRow>
            </TableBody>
          </Table>
        </ScrollView>
      }
      example2={
        <ScrollView
          className={`h-[200px] ${Platform.OS === "web" ? "w-full" : ""}`}
        >
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Order id</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Order price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableData>571</TableData>
                <TableData>3</TableData>
                <TableData>Rajesh Kumar</TableData>
                <TableData>New Jersey</TableData>
                <TableData>$ 200</TableData>
                <TableData>
                  <Badge
                    size="sm"
                    action="success"
                    className="w-fit justify-center"
                  >
                    <BadgeText>Completed</BadgeText>
                  </Badge>
                </TableData>
              </TableRow>
              <TableRow>
                <TableData>5231</TableData>
                <TableData>2</TableData>
                <TableData>Priya Sharma</TableData>
                <TableData>Austin</TableData>
                <TableData>$ 150</TableData>
                <TableData>
                  <Badge
                    size="sm"
                    action="info"
                    className="w-fit justify-center"
                  >
                    <BadgeText>Processing</BadgeText>
                  </Badge>
                </TableData>
              </TableRow>
              <TableRow>
                <TableData>5771</TableData>
                <TableData>3</TableData>
                <TableData>Ravi Patel</TableData>
                <TableData>Seattle</TableData>
                <TableData>$ 215</TableData>
                <TableData>
                  <Badge
                    size="sm"
                    action="warning"
                    className="w-fit justify-center"
                  >
                    <BadgeText>Shipped</BadgeText>
                  </Badge>
                </TableData>
              </TableRow>
              <TableRow>
                <TableData>5231</TableData>
                <TableData>4</TableData>
                <TableData>Ananya Gupta</TableData>
                <TableData>California</TableData>
                <TableData>$ 88</TableData>
                <TableData>
                  <Badge
                    size="sm"
                    action="info"
                    className="w-fit justify-center"
                  >
                    <BadgeText>Processing</BadgeText>
                  </Badge>
                </TableData>
              </TableRow>
              <TableRow>
                <TableData>5771</TableData>
                <TableData>3</TableData>
                <TableData>Arjun Singh</TableData>
                <TableData>Seattle</TableData>
                <TableData>$ 115</TableData>
                <TableData>
                  <Badge
                    size="sm"
                    action="info"
                    className="w-fit justify-center"
                  >
                    <BadgeText>Processing</BadgeText>
                  </Badge>
                </TableData>
              </TableRow>
              <TableRow>
                <TableData>5771</TableData>
                <TableData>3</TableData>
                <TableData>Nisha Verma</TableData>
                <TableData>Austin</TableData>
                <TableData>$ 115</TableData>
                <TableData>
                  <Badge
                    size="sm"
                    action="success"
                    className="w-fit justify-center"
                  >
                    <BadgeText>Completed</BadgeText>
                  </Badge>
                </TableData>
              </TableRow>
            </TableBody>
          </Table>
        </ScrollView>
      }
      notes={`To set specific dimensions, use <ScrollView className="w-[200px] h-[200px]">. 
          \nFor horizontal scrolling on web and mobile, use <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }} className="w-full">
          \nFor vertical scrolling on web and mobile use <ScrollView className={\`h-[200px] ${Platform.OS === "web" ? "w-full" : ""}\`}>`}
      warnings={`The gs-TableBasic snippet includes bad styling.
          \nYou may need to reload the project on mobile to get styles to apply correctly.`}
      errors={"2-axis scrolling does not currently work on desktop or Android."}
    />
  );
};

export default TableDemo;
