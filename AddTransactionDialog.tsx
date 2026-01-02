import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Transaction, Category } from '@/types/finance';

interface AddTransactionDialogProps {
  categories: Category[];
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

export function AddTransactionDialog({ categories, onAdd }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const filteredCategories = categories.filter(c => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!value || !description || !category) return;

    onAdd({
      date,
      value: parseFloat(value),
      description,
      category,
      type,
    });

    setOpen(false);
    setValue('');
    setDescription('');
    setCategory('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary text-primary-foreground rounded-xl px-6 glow-primary font-medium">
          <Plus className="h-4 w-4 mr-2" />
          Nova Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass-strong border-border rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Adicionar Transação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                type === 'expense' 
                  ? 'gradient-expense text-white glow-expense' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
              onClick={() => setType('expense')}
            >
              Despesa
            </button>
            <button
              type="button"
              className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                type === 'income' 
                  ? 'gradient-income text-primary-foreground glow-income' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
              onClick={() => setType('income')}
            >
              Receita
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-muted-foreground">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="bg-secondary border-border rounded-xl h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="value" className="text-muted-foreground">Valor (R$)</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={value}
              onChange={e => setValue(e.target.value)}
              className="bg-secondary border-border rounded-xl h-12 number-display text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-muted-foreground">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Almoço, Gasolina..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="bg-secondary border-border rounded-xl h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-muted-foreground">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-secondary border-border rounded-xl h-12">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border rounded-xl">
                {filteredCategories.map(cat => (
                  <SelectItem key={cat.id} value={`${cat.name} ${cat.emoji}`} className="rounded-lg">
                    {cat.emoji} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full gradient-primary text-primary-foreground rounded-xl h-12 font-medium glow-primary">
            Adicionar Transação
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}