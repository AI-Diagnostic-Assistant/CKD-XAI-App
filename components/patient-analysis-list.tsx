"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { getPatientsWithAnalyses } from "@/lib/data-access/analysis";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { formatDateToNo, isActive } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { PatientReport } from "@/lib/types";

export default function PatientAnalysisList() {
  const [patientData, setPatientData] = useState<any[]>([]);
  const path = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPatientsWithAnalyses();
      setPatientData(data);
    };
    fetchData();
  }, []);

  return (
    <SidebarMenu>
      {patientData &&
        patientData.map((patientReport: PatientReport) => (
          <Collapsible
            defaultOpen
            key={patientReport.id}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="flex justify-between">
                  <p className="text-sm">{patientReport.name}</p>
                  <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {patientReport.report.map((analysis: any) => (
                    <SidebarMenuSubItem key={analysis.id}>
                      <SidebarMenuSubButton
                        href={`/analysis/${analysis.id}`}
                        isActive={isActive(path, String(analysis.id))}
                      >
                        <p className="text-gray-700">
                          {" "}
                          {formatDateToNo(analysis.createdAt)}
                        </p>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
    </SidebarMenu>
  );
}
