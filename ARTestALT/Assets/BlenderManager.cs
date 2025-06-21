using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BlenderManager : MonoBehaviour
{

    public BlendConstraint c1, c2;
    public EventTrigger_C[] eventT;
    public int ind = 0;
    public int max = 3;
    // Start is called before the first frame update
    void Start()
    {
        
    }

    float _td = 2;
    // Update is called once per frame
    void Update()
    {
        if (c1 && c2 && c1.Active && c2.Active && _td <= 0 && ind < max)
        {
            eventT[ind++].Trigger();
            if (c1.Active) Destroy(c1.o);
            _td = 2;
        }

        if (_td > 0)
            _td -= Time.deltaTime;
    }
}
