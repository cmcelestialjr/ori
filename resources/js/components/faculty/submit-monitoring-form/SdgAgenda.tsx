import { useState } from "react";
import { MdImageNotSupported } from "react-icons/md";
import { SdgAgendaType } from "../hooks/useGetSdgAgenda";
import { FaPlus } from "react-icons/fa";
import Modal from "../../shared/components/Modal";
import { Card } from "./SdgAgendaCard";
import { Control, useController } from "react-hook-form";
import { FormData } from "./CreateResearchMonitoringForm";

type SDGAgendaProps = {
  sdgAgenda: SdgAgendaType | undefined;
  control: Control<FormData>;
  // selectedFile: string | undefined;
};


const SdgAgenda = ({ control, sdgAgenda }: SDGAgendaProps) => {
  const [modalOpen, setModalOpen] = useState({ sdg: false, agenda: false });

  const { field: sdgField } = useController({
    name: "sdg_mappings",
    control,
    defaultValue: [],
  });

  const { field: agendaField } = useController({
    name: "agenda_mappings",
    control,
    defaultValue: [],
  });

  const handleModalCardClick = (id: number, sdg: boolean, agenda: boolean) => {
    if (sdg) {
      const newSdg = sdgField.value.includes(id)
        ? sdgField.value.filter((sdgId: number) => sdgId !== id)
        : [...sdgField.value, id];
      sdgField.onChange(newSdg);
    }

    if (agenda) {
      const newAgenda = agendaField.value.includes(id)
        ? agendaField.value.filter((agendaId: number) => agendaId !== id)
        : [...agendaField.value, id];
      agendaField.onChange(newAgenda);
    }
  };

  const renderSdgCard = () => {
    const sdgs = sdgAgenda?.sdg?.filter((sdg) =>
      sdgField.value.includes(sdg.id),
    );
    return <>{sdgs?.map((sdg) => <Card key={sdg.id} card={sdg} />)}</>;
  };

  const renderAgendaCard = () => {
    const agendas = sdgAgenda?.agenda?.filter((agenda) =>
      agendaField.value.includes(agenda.id),
    );
    return (
      <>{agendas?.map((agenda) => <Card key={agenda.id} card={agenda} />)}</>
    );
  };

  const sdg = sdgAgenda?.sdg;
  const agenda = sdgAgenda?.agenda;

  return (
    <div className="flex w-full flex-col items-start justify-center">
      <p className="mb-5 text-gray-800">
        Please select the relevant SDG and Agenda for your research. You can
        add more by pressing the '+' button.
      </p>
      <label
        htmlFor="sdg"
        className="text-md font-semibold after:ml-1 after:text-red-500 after:content-['*']"
      >
        Sustainable Development Growth Mapping
      </label>

      {/* {isLoading ? (
        <AiOutlineLoading3Quarters className="my-5 size-8 animate-spin text-blue-500" />
      ) : ( */}
      <div className="my-5 flex w-full gap-x-5 overflow-y-auto">
        {sdgField.value.length !== 0 && renderSdgCard()}
        <div
          onClick={() => setModalOpen({ sdg: true, agenda: false })}
          className="flex h-[19rem] min-w-40 cursor-pointer items-center justify-center rounded-md border border-dashed border-blue-500"
        >
          <FaPlus className="size-5 text-blue-500" />
        </div>
      </div>
      {/* )} */}
      <Modal
        isOpen={modalOpen.sdg}
        onClose={() => setModalOpen({ sdg: false, agenda: false })}
        title="Select the best Sustainable Development Growth"
      >
        {sdg && sdg.length > 0 ? (
          <div className="grid grid-cols-4 gap-5">
            {sdg.map((card) => (
              <Card
                key={card.id}
                onClick={() => handleModalCardClick(card.id, true, false)}
                card={card}
                className={`cursor-pointer p-3 ${
                  sdgField.value.some((s) => s === card.id)
                    ? "border-blue-500"
                    : "border-gray-500"
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
            <MdImageNotSupported className="size-16" />
            <p className="text-center text-sm font-medium">
              No SDG items available yet.<br />Please contact your administrator to add SDG mappings.
            </p>
          </div>
        )}
      </Modal>

      <label
        htmlFor="sdg"
        className="text-md font-semibold after:ml-1 after:text-red-500 after:content-['*']"
      >
        Agenda Mapping
      </label>

      {/* {isLoading ? (
        <AiOutlineLoading3Quarters className="my-5 size-8 animate-spin text-blue-500" />
      ) : ( */}
      <div className="my-5 flex w-full gap-x-5 overflow-y-auto">
        {agendaField.value.length !== 0 && renderAgendaCard()}
        <div
          onClick={() => setModalOpen({ sdg: false, agenda: true })}
          className="flex h-[19rem] min-w-40 cursor-pointer items-center justify-center rounded-md border border-dashed border-blue-500"
        >
          <FaPlus className="size-5 text-blue-500" />
        </div>
      </div>
      {/* )} */}
      <Modal
        isOpen={modalOpen.agenda}
        onClose={() => setModalOpen({ sdg: false, agenda: false })}
        title="Select the best Agenda"
      >
        {agenda && agenda.length > 0 ? (
          <div className="grid grid-cols-4 gap-5">
            {agenda.map((card) => (
              <Card
                key={card.id}
                onClick={() => handleModalCardClick(card.id, false, true)}
                card={card}
                className={`cursor-pointer p-3 ${
                  agendaField.value.some((a) => a === card.id)
                    ? "border-blue-500"
                    : "border-gray-500"
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
            <MdImageNotSupported className="size-16" />
            <p className="text-center text-sm font-medium">
              No Agenda items available yet.<br />Please contact your administrator to add Agenda mappings.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SdgAgenda;
