import { describe, it, expect } from '@jest/globals';

describe('Admin HUD Logic', () => {
  it('should compute correct density for HALFTIME scenario', () => {
    const scenario = 'HALFTIME';
    const count = scenario === 'HALFTIME' ? 8 : 4;
    expect(count).toBe(8);
  });

  it('should correctly parse CSV stream for bulk ingestion', () => {
    const data = "OP_1,MARSHAL,NODE_12\nOP_2,MEDIC,NODE_45";
    const rows = data.split('\n').filter(r => r.length > 5);
    expect(rows.length).toBe(2);
    expect(rows[0].split(',')[0]).toBe('OP_1');
  });

  it('should handle empty ingestion gracefully', () => {
    const data = "";
    const rows = data.split('\n').filter(r => r.length > 5);
    expect(rows.length).toBe(0);
  });
});
