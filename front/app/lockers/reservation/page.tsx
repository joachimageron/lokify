"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Button, Input, Select, SelectItem } from "@heroui/react";
import { motion } from "framer-motion";

// Test datas (to replace by dynamic datas in Back)
const lockersData = [
    { id: 1, size: 1, occupied: false },
    { id: 2, size: 2, occupied: true },
    { id: 3, size: 3, occupied: false },
    { id: 4, size: 1, occupied: false },
    { id: 5, size: 1, occupied: true },
    { id: 6, size: 2, occupied: false },
    { id: 7, size: 3, occupied: true },
    { id: 8, size: 1, occupied: false },
    { id: 9, size: 2, occupied: false },
    { id: 10, size: 1, occupied: false },
    { id: 11, size: 1, occupied: false },
    { id: 12, size: 1, occupied: true },
    { id: 13, size: 1, occupied: true },
    { id: 14, size: 3, occupied: false },
    { id: 15, size: 1, occupied: false },
    { id: 16, size: 2, occupied: true },
    { id: 17, size: 1, occupied: false },
    { id: 18, size: 3, occupied: false },
    { id: 19, size: 1, occupied: false },
    { id: 20, size: 2, occupied: true },
];

// time slots' generation (every 30 minutes)
const generateTimeSlots = () => {
    const slots = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 30) {
            slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
        }
    }
    return slots;
};

const timeSlots = generateTimeSlots();

export default function ReservationPage() {
    const [selectedLockers, setSelectedLockers] = useState<number[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const toggleLockerSelection = (id: number) => {
        setSelectedLockers((prev) =>
            prev.includes(id) ? prev.filter((lockerId) => lockerId !== id) : [...prev, id]
        );
    };

    const getPrice = (size: number, days: number) => {
        return size * days * 5; // Static price exemple : 5€ by size unit & day
    };

    const totalPrice = selectedLockers.reduce((acc, id) => {
        const locker = lockersData.find((l) => l.id === id);
        return locker ? acc + getPrice(locker.size, selectedDate ? (new Date(selectedDate).getDate() - new Date().getDate() + 1) : 1) : acc;
    }, 0);

    return (
    <main className="flex flex-col items-center py-[105px] px-[20px] md:px-[150px] min-h-screen bg-home-img">
        <div className="flex w-full flex-col gap-4 rounded-large bg-content1 px-4 md:px-8  py-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Choix de vos casiers</h1>
            <p className="text-lg text-gray-700 mb-4">
                Nos casiers actuellement disponibles sont en bleu et ceux déja loués en rouge. 
                Vous pouvez choisir un ou plusieurs casiers en cliquant dessus, ceux-ci passeront alors en jaune.<br></br>
                Une fois sélectionnés, leurs détails apparaîtront en bas de l'écran, où vous pourrez choisir 
                votre durée de réservation et consulter le prix total. Vous pouvez réserver des casiers pour une durée maximale d'une semaine.
            
            </p>
            <div className="overflow-x-auto">
                <div className="grid grid-rows-3 w-fit md:px-3 py-1" style={{ gridAutoFlow: "column dense" }}>
                    {lockersData.map((locker) => (
                        <motion.button key={locker.id}
                            className={`relative flex flex-col justify-center items-center p-4 border text-white font-bold cursor-pointer transition w-[125px] min-h-[100px] rounded-[4px] ${locker.occupied ? "bg-red-500 pointer-events-none" : selectedLockers.includes(locker.id) ? "bg-yellow-500" : "bg-blue-500 hover:bg-blue-600"}`}
                            style={{ gridRow: `span ${locker.size}` }} 
                            onClick={() => !locker.occupied && toggleLockerSelection(locker.id)}
                        >
                            <span className="absolute top-[8px] px-[12px] bg-white text-gray-800 negative-shadow">{locker.id}</span>
                            <span className="locker-emoji text-xl absolute left-[10px] top-[50%] translate-y-[-50%]">🔒</span>
                            <span className="locker-decoration absolute left-[50%] bottom-[20px] translate-x-[-50%] w-[45%] h-[2px] bg-gray-300 rounded"></span>
                        </motion.button>
                    ))}
                </div>
            </div>

            {selectedLockers.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mt-6 w-full max-w-md">
                    <Card shadow="sm" className="rounded-none">
                        <CardHeader className="flex flex-col items-center">
                            <h2 className="text-lg font-bold text-gray-800">Détails de la réservation</h2>
                            <p className="text-sm text-gray-500">Casiers sélectionnés : {selectedLockers.join(", ")}</p>
                        </CardHeader>

                        <Divider />

                        <CardBody className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                                <Input type="date" min={new Date().toISOString().split("T")[0]} max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} onChange={(e) => setSelectedDate(e.target.value)}/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Heure de restitution</label>
                                <Select placeholder="Choisir une heure" onSelectionChange={(value) => setSelectedTime(value)}>
                                    {timeSlots.map((time) => (
                                        <SelectItem key={time} value={time}>
                                            {time}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </CardBody>

                        <Divider />

                        <CardFooter className="flex flex-col gap-4 items-center">
                            <p className="font-semibold text-gray-700">
                                Prix total : 
                                <span className="text-blue-600">{totalPrice.toFixed(2)} €</span>
                            </p>

                            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg rounded-lg">Passer au paiement</Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            )}  
        </div>
    </main>
    );
}
  