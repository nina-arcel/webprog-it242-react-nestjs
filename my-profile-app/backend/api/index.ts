import express, { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// GET all entries
app.get('/api/guestbook', async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('guestbook_entries')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET single entry
app.get('/api/guestbook/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('guestbook_entries')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) return res.status(404).json({ error: 'Entry not found' });
  res.json(data);
});

// POST new entry
app.post('/api/guestbook', async (req: Request, res: Response) => {
  const { name, message } = req.body;
  
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }
  
  const { data, error } = await supabase
    .from('guestbook_entries')
    .insert([{ name, message }])
    .select();
  
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// PATCH update entry
app.patch('/api/guestbook/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, message } = req.body;
  
  const { data, error } = await supabase
    .from('guestbook_entries')
    .update({ name, message, updated_at: new Date() })
    .eq('id', id)
    .select();
  
  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Entry not found' });
  }
  res.json(data[0]);
});

// DELETE entry
app.delete('/api/guestbook/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const { error } = await supabase
    .from('guestbook_entries')
    .delete()
    .eq('id', id);
  
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

export default app;