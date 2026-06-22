'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addCow } from '@/api/stado';
import { toast } from 'sonner';
import { PlusIcon, Trash2Icon } from 'lucide-react';

interface AddCowsStepProps {
  farmId: string;
  onComplete: () => void;
}

interface CowEntry {
  earTagNumber: string;
  name: string;
}

export const AddCowsStep: React.FC<AddCowsStepProps> = ({ farmId, onComplete }) => {
  const [cows, setCows] = useState<CowEntry[]>([{ earTagNumber: '', name: '' }]);
  const [loading, setLoading] = useState(false);

  const handleAddRow = () => {
    setCows([...cows, { earTagNumber: '', name: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    const newCows = [...cows];
    newCows.splice(index, 1);
    setCows(newCows);
  };

  const handleChange = (index: number, field: keyof CowEntry, value: string) => {
    const newCows = [...cows];
    newCows[index][field] = value;
    setCows(newCows);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filtrujemy puste wiersze
    const validCows = cows.filter(c => c.earTagNumber && c.name);
    
    if (validCows.length === 0) {
      onComplete(); // Jeśli nic nie wpisano, po prostu kończymy (bo to opcjonalne)
      return;
    }

    setLoading(true);
    try {
      // W realnym świecie pewnie byłby endpoint do bulk insert, tutaj robimy w pętli dla uproszczenia
      // lub zakładamy że addCow obsługuje pojedynczą krowę
      await Promise.all(
        validCows.map((cow) =>
          addCow({
            name: cow.name,
            earTagNumber: cow.earTagNumber,
            birthDate: new Date().toISOString(), // Domyślna data
            breed: 'HO', // Domyślna rasa
            bookType: 'A', // Domyślny typ księgi
          })
        )
      );
      toast.success(`Dodano ${validCows.length} krów do stada`);
      onComplete();
    } catch (error) {
      console.error(error);
      toast.error('Wystąpił błąd podczas dodawania krów');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Dodaj pierwsze krowy (opcjonalnie)</CardTitle>
        <CardDescription>
          Możesz teraz dodać kilka krów do swojego stada lub zrobić to później.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-7 gap-4 mb-2">
            <Label className="col-span-3">Numer kolczyka</Label>
            <Label className="col-span-3">Imię / Numer krowy</Label>
            <div className="col-span-1"></div>
          </div>
          
          {cows.map((cow, index) => (
            <div key={index} className="grid grid-cols-7 gap-4 items-center">
              <div className="col-span-3">
                <Input 
                  placeholder="np. PL005123456789" 
                  value={cow.earTagNumber}
                  onChange={(e) => handleChange(index, 'earTagNumber', e.target.value)}
                />
              </div>
              <div className="col-span-3">
                <Input 
                  placeholder="np. Bella" 
                  value={cow.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                />
              </div>
              <div className="col-span-1">
                {cows.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveRow(index)}
                  >
                    <Trash2Icon className="size-4 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          <Button 
            type="button" 
            variant="outline" 
            className="w-full mt-2" 
            onClick={handleAddRow}
          >
            <PlusIcon className="size-4 mr-2" />
            Dodaj kolejny wiersz
          </Button>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="ghost" onClick={onComplete} disabled={loading}>
            Dodaj później
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Zapisywanie...' : 'Zakończ konfigurację'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
